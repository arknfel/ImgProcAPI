import supertest from 'supertest';
import app from '../index';

const request = supertest(app);
describe('Test endpoint responses', () => {

    it('gets the api endpoint', async () => {
        let url = '/api/images?filename=testimage.jpg&width=100&height=100';
        const response = await request.get(url);
        expect(response.status).toBe(200);
        // done();
    });

    it('wrong endpoint/resources', async () => {
        const response = await request.get('/api');
        expect(response.status).toBe(404);
        // done();
    });

    it('missing file extension, 400', async () => {
        let url = '/api/images?filename=testimage&width=100&height=100';
        const response = await request.get(url);
        expect(response.status).toBe(404);
        // done();
    });

    it('missing parameter, 400', async () => {
        let url = '/api/images?filename=testimage.jpg&width=100';
        const response = await request.get(url);
        expect(response.status).toBe(400);
        // done();
    });

    it('Invalid height/width', async () => {
        let url = '/api/images?filename=testimage.jpg&width=100&height=-100';
        const response = await request.get(url);
        expect(response.status).toBe(400);
        // done();
    });
});