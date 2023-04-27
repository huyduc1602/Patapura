import { format, parse } from 'date-fns';

type StringOptions = {
  input?: string;
  output?: string;
};

class _Helpers {
  toDateTimeFormat = function (value: string, options?: StringOptions) {
    const _input = options?.input ?? 'yyyy-MM-dd HH:mm:ss';
    const _output = options?.output ?? 'yyyy年MM月dd日';

    try {
      const _date = parse(value, _input, new Date());

      return format(_date, _output);
    } catch (error) {
      return 'N/A';
    }
  };

  dateToString = function (value: Date, output?: string) {
    const _output = output ?? 'yyyy-MM-dd';

    try {
      return format(value, _output);
    } catch (error) {
      return 'N/A';
    }
  };
}

export const Helpers = new _Helpers();
