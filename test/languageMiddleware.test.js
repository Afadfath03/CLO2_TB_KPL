const languageMiddleware = require('../middleware/languageMiddleware');

describe('Language Middleware', () => {
    it('should set req.lang to the accept-language header value', () => {
        const req = {
            headers: {
                'accept-language': 'id'
            }
        };
        const res = {};
        const next = jest.fn();

        languageMiddleware(req, res, next);

        expect(req.lang).toBe('id');
        expect(next).toHaveBeenCalled();
    });

    it('should default req.lang to "en" if header is missing', () => {
        const req = {
            headers: {}
        };
        const res = {};
        const next = jest.fn();

        languageMiddleware(req, res, next);

        expect(req.lang).toBe('en');
        expect(next).toHaveBeenCalled();
    });
});
