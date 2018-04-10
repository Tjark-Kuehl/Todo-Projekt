const SECRETKEY = 'PÜI134J"J$134IH14$"ZÜH$31414ZIPG1341HWG$G"Ü$P$4134'

function xor_encode(s) {
    let enc = ''
    let str = s.toString()

    for (let i = 0; i < str.length; i++) {
        let a = str.charCodeAt(i)
        let b = a ^ SECRETKEY.charCodeAt(i % SECRETKEY.length)
        enc += String.fromCharCode(b)
    }
    return btoa(enc)
}

function xor_decode(s) {
    let enc = ''
    let str = atob(s.toString())

    for (let i = 0; i < str.length; i++) {
        let a = str.charCodeAt(i)
        let b = a ^ SECRETKEY.charCodeAt(i % SECRETKEY.length)
        enc += String.fromCharCode(b)
    }
    return enc
}
