export function handleXHRError(deferred, XHR, messagePrefix) {
    var err = createError(XHR);
    if (messagePrefix) {
        err.message = messagePrefix + "; " + err.message;
    }
    deferred.reject(err);
    XHR.onreadystatechange = null;
    XHR.abort = null;
}

export function createError(XHR) {
    var err = new Error();
    err.XHR = XHR;
    err.message = XHR.statusText;
    err.responseText = XHR.responseText;
    err.status = XHR.status;
    err.statusText = XHR.statusText;
    if (err.responseText) {
        try {
            var responseObj = JSON.parse(XHR.responseText);
            err.detail = responseObj;
            var source = responseObj.InnerException || responseObj;
            err.message = source.ExceptionMessage || source.Message || XHR.responseText;
        } catch (e) {

        }
    }
    return err;
}