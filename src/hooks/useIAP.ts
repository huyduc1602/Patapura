import { PROUCT_IDS } from '@/constants/iap';
import { useState, useEffect, useCallback } from 'react';
import { Platform, EmitterSubscription } from 'react-native';
import {
  initConnection,
  requestPurchase,
  Product,
  Purchase,
  endConnection,
  PurchaseError,
  getProducts,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
} from 'react-native-iap';

type IAPConfig = {
  setIAPError: (message: string) => void;
};

export const useIAP = ({ setIAPError }: IAPConfig) => {
  const [connected, setConnected] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [purchase, setPurcase] = useState<Purchase | null>(null);

  const _requestPurchase = useCallback(async (sku: string) => {
    try {
      return await requestPurchase({
        sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
    } catch (err: any) {
      console.warn(err.code, err.message);
    }
  }, []);

  const restorePurchase = useCallback(async () => {
    try {
      return await getAvailablePurchases();
    } catch (err: any) {
      console.warn(err.code, err.message);
    }
  }, []);

  const purchaseListener = async (purchase: Purchase) => {
    console.log('Purchase received');
    if (purchase.isAcknowledgedAndroid) return;

    console.log('Successfully purchased', purchase.productId);
    console.log({ purchase });

    setPurcase(purchase);
  };

  const _purchaseErrorListener = (error: PurchaseError) => {
    setIAPError(`購入に失敗しました。code ${error.code}: ${error.message}`);
    console.log(`Purchase error: ${error.debugMessage}`);
  };

  useEffect(() => {
    console.log('Trying to connect to IAP store.');
    let subscription: EmitterSubscription;
    let subscriptionError: EmitterSubscription;
    initConnection()
      .then(async () => {
        setConnected(true);
        console.log('Listening to IAP updates');

        const _products = await getProducts(PROUCT_IDS);
        console.log({ _products });

        subscription = purchaseUpdatedListener(purchaseListener);
        subscriptionError = purchaseErrorListener(_purchaseErrorListener);
        setProducts(_products);
      })
      .catch((e) => {
        console.log('Error connecting to IAP store:', e);
      });
    return () => {
      console.log('IAP provider unmounted');
      subscription.remove();
      subscriptionError.remove();
      endConnection().catch((reason) => {
        console.log('Error ending connection:', reason);
      });
    };
  }, []);

  return { connected, requestPurchase: _requestPurchase, restorePurchase, products, purchase };
};
