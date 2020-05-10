import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(router, apps, toastr) {
        var _this = this;
        this.router = router;
        this.apps = apps;
        this.toastr = toastr;
        this.signup = function () {
            _this.router.navigate(['/signup']);
        };
        this.signin = function () {
            if (!_this.email) {
                _this.toastr.warning('Please enter email');
            }
            else if (!_this.password) {
                _this.toastr.warning('Please enter password');
            }
            else {
                var data = {
                    email: _this.email,
                    password: _this.password
                };
                _this.apps.login(data).subscribe(function (apiResponse) {
                    if (apiResponse.status == 200) {
                        console.log(apiResponse);
                        Cookie.set('authToken', apiResponse.data.authToken);
                        _this.router.navigate(['/chat']);
                    }
                }, function (error) {
                    _this.toastr.error("Error");
                });
            }
        };
        this.loginUsingKeyPress = function (event) {
            if (event.keyCode === 13) {
                _this.signin();
            }
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent = tslib_1.__decorate([
        Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [Router, AppService, ToastrService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map