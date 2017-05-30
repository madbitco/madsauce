!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.approve = t();
}(this, function() {
    "use strict";
    function e() {
        this.scheme = "", this.valid = !1;
    }
    function t(e) {
        this.strength = e, this.points = 0, this.isMinimum = !1, this.hasLower = !1, this.hasUpper = !1, 
        this.hasNumber = !1, this.hasSpecial = !1, this.isBonus = !1, this.percent = 0, 
        this.valid = !1, this.errors = [];
    }
    var r = {
        message: "{title} is not a valid credit card number",
        schemes: [ {
            regex: /^(5610|560221|560222|560223|560224|560225)/,
            scheme: "Australian Bank Card"
        }, {
            regex: /^(2014|2149)/,
            scheme: "Diner's Club"
        }, {
            regex: /^36/,
            scheme: "Diner's Club International"
        }, {
            regex: /^(30[0-5]|36|38|54|55|2014|2149)/,
            scheme: "Diner's Club / Carte Blanche"
        }, {
            regex: /^35(2[89]|[3-8][0-9])/,
            scheme: "Japanese Credit Bureau"
        }, {
            regex: /^(5018|5020|5038|6304|6759|676[1-3])/,
            scheme: "Maestro"
        }, {
            regex: /^5[1-5]/,
            scheme: "Mastercard"
        }, {
            regex: /^(6304|670[69]|6771)/,
            scheme: "Laser"
        }, {
            regex: /^(6334|6767)/,
            scheme: "Solo (Paymentech)"
        }, {
            regex: /^(6011|622|64|65)/,
            scheme: "Discover"
        }, {
            regex: /^3[47]/,
            scheme: "American Express"
        }, {
            regex: /^(4026|417500|4508|4844|491(3|7))/,
            scheme: "Visa Electron"
        }, {
            regex: /^(4)/,
            scheme: "Visa"
        } ],
        _getScheme: function(e) {
            e = ("" + e).replace(/\D/g, "");
            for (var t = this.schemes.length; t--; ) if (this.schemes[t].regex.test(e)) return this.schemes[t].scheme;
        },
        validate: function(t) {
            t = ("" + t).replace(/\D/g, "");
            var r, s = new e(), a = t.length, i = 0, n = 1;
            if (a < 12) return !1;
            for (;a--; ) r = t.charAt(a) * n, i += r - 9 * (r > 9), n ^= 3;
            return s.valid = i % 10 == 0 && i > 0, s.scheme = this._getScheme(t), s;
        }
    }, s = {
        minimum: 8,
        minimumBonus: 10,
        strengths: {
            0: "Very Weak",
            1: "Weak",
            2: "Better",
            3: "Almost",
            4: "Acceptable",
            5: "Strong",
            6: "Very Strong"
        },
        message: "{title} did not pass the strength test.",
        expects: [ "min", "bonus" ],
        errors: {
            isMinimum: "{title} must be at least {min} characters",
            hasLower: "{title} must have at least 1 lower case character",
            hasUpper: "{title} must have at least 1 upper case character",
            hasNumber: "{title} must have at least 1 number",
            hasSpecial: "{title} must have at least 1 special character"
        },
        _getScore: function(e) {
            var r = new t(this.strengths[0]);
            return e.length > this.minimumBonus ? (r.points += 2, r.isBonus = !0, r.isMinimum = !0) : e.length > this.minimum ? (r.points++, 
            r.isMinimum = !0) : (r.points = 1, r.isMinimum = !1), r.hasLower = null !== e.match(/[a-z]/), 
            r.isMinimum && r.hasLower && r.points++, r.hasUpper = null !== e.match(/[A-Z]/), 
            r.isMinimum && r.hasUpper && r.points++, r.hasNumber = null !== e.match(/\d+/), 
            r.isMinimum && r.hasNumber && r.points++, r.hasSpecial = null !== e.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/), 
            r.isMinimum && r.hasSpecial && r.points++, r.percent = Math.ceil(r.points / 6 * 100), 
            r;
        },
        _getStrength: function(e) {
            var t = this._getScore(e);
            return t.strength = this.strengths[t.points], t.isMinimum || t.errors.push(this.errors.isMinimum), 
            t.hasLower || t.errors.push(this.errors.hasLower), t.hasUpper || t.errors.push(this.errors.hasUpper), 
            t.hasSpecial || t.errors.push(this.errors.hasSpecial), t.hasNumber || t.errors.push(this.errors.hasNumber), 
            t.points > 4 && (t.valid = !0), t;
        },
        validate: function(e, t) {
            if (this.minimum = t.min || this.minimum, this.minimumBonus = t.bonus || this.minimumBonus, 
            t.hasOwnProperty("config") && t.config.hasOwnProperty("messages")) for (var r in t.config.messages) t.config.messages.hasOwnProperty(r) && (this.errors[r] = t.config.messages[r]);
            return this._getStrength(e);
        }
    }, i = function() {
        this.approved = !0, this.errors = [], this.failed = [], this.each = function(e) {
            for (var t = e && e.constructor && e.call && e.apply, r = this.errors.length; r--; ) t && e(this.errors[r]);
        }, this.filter = function(e, t) {
            var r = t && t.constructor && t.call && t.apply, s = 0;
            if (this.hasOwnProperty(e)) for (s = this[e].errors.length; s--; ) r && t(this[e].errors[s]);
        };
    };
    return {
        tests: {
            required: {
                validate: function(e) {
                    return !!e;
                },
                message: "{title} is required",
                expects: !1
            },
            email: {
                regex: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} must be a valid email address",
                expects: !1
            },
            url: {
                regex: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} must be a valid web address",
                expects: !1
            },
            alphaNumeric: {
                regex: /^[A-Za-z0-9]+$/i,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} may only contain [A-Za-z] and [0-9]",
                expects: !1
            },
            numeric: {
                regex: /^-?[0-9]+$/,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} may only contain [0-9]",
                expects: !1
            },
            alpha: {
                regex: /^[A-Za-z]+$/,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} may only contain [A-Za-z]",
                expects: !1
            },
            decimal: {
                regex: /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} must be a valid decimal",
                expects: !1
            },
            currency: {
                regex: /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} must be a valid currency value",
                expects: !1
            },
            ip: {
                regex: {
                    ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
                    ipv4Cidr: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/,
                    ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
                    ipv6Cidr: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/
                },
                validate: function(e) {
                    return this.regex.ipv4.test(e) || this.regex.ipv6.test(e) || this.regex.ipv4Cidr.test(e) || this.regex.ipv6Cidr.test(e);
                },
                message: "{title} must be a valid IP address",
                expects: !1
            },
            min: {
                validate: function(e, t) {
                    return "string" == typeof e && e.length >= t.min;
                },
                message: "{title} must be a minimum of {min} characters",
                expects: [ "min" ]
            },
            max: {
                validate: function(e, t) {
                    return "string" == typeof e && e.length <= t.max;
                },
                message: "{title} must be a maximum of {max} characters",
                expects: [ "max" ]
            },
            range: {
                validate: function(e, t) {
                    return "string" == typeof e ? e.length >= t.min && e.length <= t.max : "number" == typeof e && e >= t.min && e <= t.max;
                },
                message: "{title} must be a minimum of {min} and a maximum of {max} characters",
                expects: [ "min", "max" ]
            },
            equal: {
                validate: function(e, t) {
                    return "" + e == "" + t.value;
                },
                message: "{title} must be equal to {field}",
                expects: [ "value", "field" ]
            },
            format: {
                validate: function(e, t) {
                    if ("[object RegExp]" === Object.prototype.toString.call(t.regex)) return t.regex.test(e);
                    throw "approve.value(): [format] - regex is not a valid regular expression.";
                },
                message: "{title} did not pass the [{regex}] test",
                expects: [ "regex" ]
            },
            time: {
                regex: /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} is not a valid time",
                expects: !1
            },
            date: {
                formats: {
                    ymd: /^(?:\2)(?:[0-9]{2})?[0-9]{2}([\/-])(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])$/,
                    dmy: /^(3[01]|[12][0-9]|0?[1-9])([\/-])(1[0-2]|0?[1-9])([\/-])(?:[0-9]{2})?[0-9]{2}$/
                },
                validate: function(e, t) {
                    return this.formats[t.format].test(e);
                },
                message: "{title} is not a valid date",
                expects: [ "format" ]
            },
            truthy: {
                regex: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/i,
                validate: function(e) {
                    return this.regex.test(e);
                },
                message: "{title} is not valid",
                expects: !1
            },
            falsy: {
                regex: /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?)$/i,
                validate: function(e) {
                    return !this.regex.test(e);
                },
                message: "{title} is not valid",
                expects: !1
            },
            cc: r,
            strength: s
        },
        _format: function(e, t) {
            return t = "object" == typeof t ? t : Array.prototype.slice.call(arguments, 1), 
            e.replace(/\{\{|\}\}|\{(\w+)\}/g, function(e, r) {
                return "{{" === e ? "{" : "}}" === e ? "}" : t[r];
            }).trim();
        },
        _isRule: function(e) {
            return [ "title", "stop", "ignoreNull" ].indexOf(e) < 0;
        },
        _start: function(e, t) {
            var r = new i(), s = "", a = !1, n = !1;
            t.hasOwnProperty("title") && (s = t.title), t.hasOwnProperty("stop") && (a = t.stop), 
            t.hasOwnProperty("ignoreNull") && (n = t.ignoreNull);
            for (var u in t) {
                if (a && !r.approved) break;
                if (t.hasOwnProperty(u) && this._isRule(u)) {
                    var o = t[u];
                    if (!this.tests.hasOwnProperty(u)) throw "approve.value(): " + u + " test not defined.";
                    var d = {
                        constraint: o,
                        rule: u,
                        title: s,
                        test: this.tests[u],
                        value: e,
                        ignoreNull: n
                    };
                    this._test(d, r);
                }
            }
            return r;
        },
        _test: function(e, t) {
            if (!e.hasOwnProperty("ignoreNull") || null !== e.value || !e.ignoreNull) {
                var r = this._getArgs(e), s = e.test.validate(e.value, r);
                if (t[e.rule] = {
                    approved: !0,
                    errors: []
                }, "object" == typeof s) {
                    if (t.approved = !!s.valid && t.approved, t[e.rule].approved = s.valid, s.hasOwnProperty("errors")) {
                        var a = this._formatMessages(s.errors, e);
                        t.errors = t.errors.concat(a), t[e.rule].errors = a;
                    }
                    for (var i in s) s.hasOwnProperty(i) && !t.hasOwnProperty(i) && (t[e.rule][i] = s[i]);
                } else {
                    if ("boolean" != typeof s) throw "approve.value(): " + e.rule + " returned an invalid value";
                    t.approved = !!s && t.approved, t[e.rule].approved = s;
                }
                if (!t.approved) {
                    var n = this._formatMessage(e);
                    t.errors.push(n), t[e.rule].errors.push(n);
                }
                s.valid || t.failed.push(e.rule);
            }
        },
        _eachExpected: function(e, t) {
            if (Array.isArray(e.test.expects)) for (var r = e.test.expects.length, s = r; s--; ) t(e.test.expects[s], r);
        },
        _getArgs: function(e) {
            var t = {};
            return this._eachExpected(e, function(r, s) {
                if (e.constraint.hasOwnProperty(r)) t[r] = e.constraint[r]; else {
                    if (!(s <= 1) || !/^[A-Za-z0-9]+$/i.test(e.constraint) && "[object RegExp]" !== toString.call(e.constraint)) throw "approve.value(): " + e.rule + " expects the " + r + " parameter.";
                    t[r] = e.constraint;
                }
            }), e.constraint.hasOwnProperty("config") && (t.config = e.constraint.config), t;
        },
        _getFormat: function(e) {
            var t = {};
            return this._eachExpected(e, function(r) {
                e.constraint.hasOwnProperty(r) && (t[r] = e.constraint[r]), /^[A-Za-z0-9]+$/i.test(e.constraint) && (t[r] = e.constraint);
            }), t.title = e.title, t;
        },
        _formatMessages: function(e, t) {
            for (var r = this._getFormat(t), s = e.length; s--; ) e[s] = this._format(e[s], r);
            return e;
        },
        _formatMessage: function(e) {
            var t, r = this._getFormat(e);
            return e.constraint.hasOwnProperty("message") ? (t = e.constraint.message, this._format(t, r)) : (t = e.test.message, 
            this._format(t, r));
        },
        value: function(e, t) {
            if ("object" != typeof t) throw "approve.value(value, rules): rules is not a valid object.";
            return this._start(e, t);
        },
        addTest: function(e, t) {
            if ("object" != typeof e) throw "approve.addTest(obj, name): obj is not a valid object.";
            try {
                this.tests.hasOwnProperty(t) || (this.tests[t] = e);
            } catch (r) {
                throw "approve.addTest(): " + r.message;
            }
        }
    };
});
//# sourceMappingURL=bundle.js.map