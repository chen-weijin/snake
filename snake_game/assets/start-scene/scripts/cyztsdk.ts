import { sys } from "cc";

export class CyZtSdk {
    static SaveKey = "cyzt_ext";
    static ReportURL = "https://service.cygame666.cn/zt/api/v1/conversion";
    static extend: any = {};

    static get openid() {
        return this.extend && this.extend.openid;
    }

    static get clickid() {
        return this.extend && this.extend.clickid;
    }

    static reportActive() {
        var t = this;
        if (void 0 !== window.tt) {
            console.log("#### CyZtSdk #### 初始化");
            var n = sys.localStorage.getItem(this.SaveKey);
            console.log("#### CyZtSdk #### 读取旧数据", n),
                n && (this.extend = JSON.parse(n)),
                CyZtSdk.openid
                    ? console.log("#### CyZtSdk #### 激活已经上报，不重复上报, openid:", CyZtSdk.openid, "clickid:", CyZtSdk.clickid)
                    : window.tt.login({
                          force: true,
                          success: function (n) {
                              console.debug("#### CyZtSdk #### login 调用成功code:" + n.code + " a_code:" + n.anonymousCode);
                              var o = window.tt.getLaunchOptionsSync(),
                                  r = JSON.stringify(o.query),
                                  a = o.extra.appId || o.query.appId;
                              console.debug("#### CyZtSdk #### appid:", a, "query:", r),
                                  window.tt.request({
                                      url: CyZtSdk.ReportURL,
                                      data: {
                                          code: n.code,
                                          anonvmous_code: n.anonymousCode,
                                          appid: a,
                                          active_data: r,
                                      },
                                      header: {
                                          "content-type": "application/json",
                                      },
                                      method: "POST",
                                      success: function (n) {
                                          if ((console.log("#### CyZtSdk #### 数据上报成功", n.data), 0 == n.data.code)) {
                                              (CyZtSdk.extend = {}),
                                                  (CyZtSdk.extend.openid = n.data.data.openid),
                                                  (CyZtSdk.extend.clickid = n.data.data.clickid);
                                              var o = JSON.stringify(CyZtSdk.extend);
                                              console.log("#### CyZtSdk #### ext:", o), sys.localStorage.setItem(t.SaveKey, o);
                                          }
                                      },
                                      fail: function (e) {
                                          console.log("#### CyZtSdk #### 数据上报失败", e.errMsg);
                                      },
                                  });
                          },
                          fail: function (e) {
                              console.debug("#### CyZtSdk #### login调用失败", e);
                          },
                      });
        } else console.log("#### CyZtSdk #### 非字节平台不初始化");
    }
}
