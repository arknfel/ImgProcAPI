import path from 'path';


import utils from '../../utilities/utilities';


describe("test function sharpResize", () => {

    it("returns true if no exceptions were catched", async () => {
        let filename = 'testimage.jpg';
        let nameParts = filename.split('.');
        let thumbName = nameParts[0] + '-thumb.' + nameParts[1];
        let imgsPath = path.join(__dirname, '../../..', 'src/tests/testImages');
        let imgPath = path.join(imgsPath, 'full', filename);
        let newPath = path.join(imgsPath, 'thumb', thumbName);
        console.log(imgPath);
    
        let width = 350;
        let height = 350;

        let resized = await utils.sharpResize(imgPath, newPath, width, height);
        expect(resized).toBeTrue();
    });

    it("throws err if requested file is not present", async () => {
        let filename = 'noimage';
        let nameParts = filename.split('.');
        let thumbName = nameParts[0] + '-thumb.' + nameParts[1];
        let imgsPath = path.join(__dirname, '../../..', 'src/tests/testImages');
        let imgPath = path.join(imgsPath, 'full', filename);
        let newPath = path.join(imgsPath, 'thumb', thumbName);

        let width = 350;
        let height = 350;

        let resized = await utils.sharpResize(imgPath, newPath, width, height);
        expect(resized).toEqual("Error: Input file is missing");
    });
});