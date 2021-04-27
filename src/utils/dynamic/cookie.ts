/* *
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

function Cookie() {
  function extend(...rest: any[]) {
    let i = 0
    let result: any = {}
    for (let item of rest) {
      for (var key in item) {
        result[key] = item[key]
      }
    }
    return result
  }
  function decode(s: any) {
    return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
  }

  function init(converter: any) {
    function api() {}
    function set(key: any, value: any, attributes: any) {
      if (typeof document === 'undefined') {
        return
      }
      attributes = extend(
        {
          path: '/'
        },
        api.defaults,
        attributes
      )
      if (typeof attributes.expires === 'number') {
        attributes.expires = new Date(+new Date() + attributes.expires * 864e5)
      }

      // We're using "expires" because "max-age" is not supported by IE
      attributes.expires = attributes.expires ? attributes.expires.toUTCString() : ''

      try {
        var result = JSON.stringify(value)
        if (/^[\{\[]/.test(result)) {
          value = result
        }
      } catch (e) {}

      value = converter.write
        ? converter.write(value, key)
        : encodeURIComponent(String(value)).replace(
            /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
            decodeURIComponent
          )

      key = encodeURIComponent(String(key))
        .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
        .replace(/[\(\)]/g, escape)

      var stringifiedAttributes = ''
      for (var attributeName in attributes) {
        if (!attributes[attributeName]) {
          continue
        }
        stringifiedAttributes += '; ' + attributeName
        if (attributes[attributeName] === true) {
          continue
        }

        // Considers RFC 6265 section 5.2:
        // ...
        // 3.  If the remaining unparsed-attributes contains a %x3B (";")
        //     character:
        // Consume the characters of the unparsed-attributes up to,
        // not including, the first %x3B (";") character.
        // ...
        stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
      }

      return (document.cookie = key + '=' + value + stringifiedAttributes)
    }

    function get(key: any, json: any) {
      if (typeof document === 'undefined') {
        return
      }

      var jar: any = {}
      // To prevent the for loop in the first place assign an empty array
      // in case there are no cookies at all.
      var cookies = document.cookie ? document.cookie.split('; ') : []
      var i = 0

      for (; i < cookies.length; i++) {
        var parts = cookies[i].split('=')
        var cookie = parts.slice(1).join('=')

        if (!json && cookie.charAt(0) === '"') {
          cookie = cookie.slice(1, -1)
        }

        try {
          var name = decode(parts[0])
          cookie = (converter.read || converter)(cookie, name) || decode(cookie)

          if (json) {
            try {
              cookie = JSON.parse(cookie)
            } catch (e) {}
          }

          jar[name] = cookie

          if (key === name) {
            break
          }
        } catch (e) {}
      }

      return key ? jar[key] : jar
    }

    api.set = set
    api.get = function (key: any) {
      return get(key, false /* read as raw */)
    }
    api.getJSON = function (key: any) {
      return get(key, true /* read as json */)
    }
    api.remove = function (key: any, attributes: any) {
      set(
        key,
        '',
        extend(attributes, {
          expires: -1
        })
      )
    }

    api.defaults = {}

    api.withConverter = init

    return api
  }

  return init(function () {})
}

export default Cookie()
