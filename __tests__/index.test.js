import {countWords, EMAIL_REGEX, TEL_REGEX, countSumOfStringNumbers} from '../index';

describe('count words', () => {
    it('should count words in text', () => {
        const text = "example text with five words";
        expect(countWords(text)).toEqual(5);
    });

    it('should throw MyError if text is not string', () => {
        const text = null;
        expect(() => {
            countWords(text)
        }).toThrow();
    });

    it('should count zero words in empty text', () => {
        const text = '  ';
        expect(countWords(text)).toEqual(0);
    });

    it('should correctly count words with large white-spaces', () => {
        const text = 'text  with large   white-space';
        expect(countWords(text)).toEqual(4);
    });
});

describe('countSumOfStringNumbers', () => {
    it('should count sum of numbers in string', () => {
        const text = '+7(111)222-33-11';
        expect(countSumOfStringNumbers(text)).toEqual(24);
    });

    it('should throw MyError if text is not string', () => {
        const text = null;
        expect(() => {
            countSumOfStringNumbers(text)
        }).toThrow();
    });

    it('should count sum of numbers in empty string', () => {
        const text = '';
        expect(countSumOfStringNumbers(text)).toEqual(0);
    });
});

describe('email regexp', () => {
    it('should pass test with yandex email', () => {
        expect(EMAIL_REGEX.test('123@yandex.ru')).toBeTruthy();
    });

    it('should not pass test with other email', () => {
        expect(EMAIL_REGEX.test('123@gmail.ru')).toBeFalsy()
    });
});

describe('phone regexp', () => {
    it('should pass test with correct phone pattern', () => {
        expect(TEL_REGEX.test('+7(111)222-33-11')).toBeTruthy();
    });

    it('should not pass test with not correct phone pattern', () => {
        expect(TEL_REGEX.test('+72224445566')).toBeFalsy()
    });
});