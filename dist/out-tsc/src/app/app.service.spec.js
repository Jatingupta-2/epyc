import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
describe('AppService', function () {
    beforeEach(function () { return TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = TestBed.get(AppService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=app.service.spec.js.map