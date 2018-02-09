function terbilang (num) {
  let rev = num.toString().replace(/\.[0-9]+/, '').split('').reverse()
  let revDecimal = ''
  if (num.toString().search(/\./) >= 0) {
    revDecimal = num.toString().replace(/[0-9]+\./, '').split('').reverse()
  }

  let result = ''
  let thousands = ''

  function toWords (arr, index, decimal) {
    let number = arr[index]
    switch (number) {
      case '.':
        if (decimal) {
          return 'koma '
        }
        break
      case '0':
        if (decimal) {
          return 'nol '
        }
        return ''
      case '1':
        if (!decimal && (index === 1 || index === 2 || arr[index + 1] === '1' || (index % 3) === 1 || (index % 3) === 2)) {
          return 'se'
        }
        return 'satu '
      case '2':
        return 'dua '
      case '3':
        return 'tiga '
      case '4':
        return 'empat '
      case '5':
        return 'lima '
      case '6':
        return 'enam '
      case '7':
        return 'tujuh '
      case '8':
        return 'delapan '
      case '9':
        return 'sembilan '
      default:
        return ''
    }
  }
  // handle decimal
  if (revDecimal) {
    for (let m = 0; m < revDecimal.length; m += 1) {
      result = toWords(revDecimal, m, true) + result
    }
    result = `koma ${result}`
  }

  // handle non-decimal
  for (let n = 0; n < rev.length; n += 1) {
    if (n === 3) {
      thousands = 'ribu '
    } else if (n === 6) {
      thousands = 'juta '
    } else if (n === 9) {
      thousands = 'miliar '
    } else if (n === 12) {
      thousands = 'triliun '
    } else if (n === 15) {
      thousands = 'kuadriliun '
    } else if (n === 18) {
      thousands = 'kuantiliun '
    } else if (n === 21) {
      thousands = 'sekstiliun '
    } else if (n === 24) {
      thousands = 'septiliun '
    } else if (n === 27) {
      thousands = 'oktiliun '
    } else if (n === 30) {
      thousands = 'noniliun '
    } else if (n === 33) {
      thousands = 'desiliun '
    }

    if (rev[n] !== '0') {
      if ((n % 3) === 0) {
        if (rev[n + 1] === '1') {
          result = `${toWords(rev, n)}belas ${thousands}${result}`
          n += 1
        } else {
          result = toWords(rev, n) + thousands + result
        }
        thousands = ''
      } else if ((n % 3) === 2) {
        result = `${toWords(rev, n)}ratus ${thousands}${result}`
        thousands = ''
      } else if ((n % 3) === 1) {
        result = `${toWords(rev, n)}puluh ${thousands}${result}`
        thousands = ''
      }
    }
  }
  return result
}

module.exports = terbilang
