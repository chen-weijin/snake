import { sys } from "cc";

export class ksZtSdk {
    static SaveKey = "kszt_ext";
    static ReportURL = "https://zhitou.xiaoyouxi.0a2d.com/api/ks/v1/conversion";
    static extend: any = {};

    static get openid() {
        return this.extend && this.extend.openid;
    }

    static get callback() {
        return this.extend && this.extend.callback;
    }

    static reportActive() {
        var t = this;
        if (void 0 !== window.ks) {
            console.log("#### ksZtSdk #### 初始化");
            var n = sys.localStorage.getItem(this.SaveKey);
            console.log("#### ksZtSdk #### 读取旧数据", n),
                n && (this.extend = JSON.parse(n)),
                ksZtSdk.openid
                    ? console.log(
                          "#### ksZtSdk #### 激活已经上报，不重复上报, openid: " + ksZtSdk.openid + ", callback: " + ksZtSdk.callback
                      )
                    : window.ks.login({
                          force: true,
                          success: function (n) {
                              console.log("#### ksKsZtSdk #### login 调用成功code:" + n.code + " ");
                              var o = window.ks.getLaunchOptionsSync(),
                                  r = JSON.stringify(o.query),
                                  a = window.ks.getSystemInfoSync().host.appId;
                              console.log("#### ksZtSdk #### appid:", a, "query:", r),
                                  window.ks.request({
                                      url: ksZtSdk.ReportURL,
                                      header: {
                                          "content-type": "application/json",
                                      },
                                      method: "POST",
                                      data: {
                                          code: n.code,
                                          anonvmous_code: n.anonymousCode,
                                          appid: a,
                                          active_data: r,
                                      },
                                      success: function (n) {
                                          if ((console.log("#### ksKsZtSdk #### 数据上报成功", JSON.stringify(n.data)), 0 == n.data.code)) {
                                              (ksZtSdk.extend = {}),
                                                  (ksZtSdk.extend.openid = n.data.data.open_id),
                                                  (window.SmSdk.savedOpenid = n.data.data.open_id);
                                              var o = JSON.stringify(ksZtSdk.extend);
                                              console.log("#### ksZtSdk #### ext:", o), sys.localStorage.setItem(t.SaveKey, o);
                                          }
                                      },
                                      fail: function (e) {
                                          console.log("#### ksKsZtSdk #### 数据上报失败", e.errMsg);
                                      },
                                  });
                          },
                          fail: function (e) {
                              console.debug("#### ksKsZtSdk #### login调用失败", e);
                          },
                      });
        } else console.log("#### ksZtSdk #### 非快手平台不初始化");
    }
}
