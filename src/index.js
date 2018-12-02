import { h as render } from 'hyperapp'

let stylesheet
let cache = new Set()

function setCorrectStylesheet() {
  if (!stylesheet) {
    const head = document.getElementsByTagName('head')[0]
    if (head) {
      const stylesheet_ = document.createElement('style')
      head.appendChild(stylesheet_)
      stylesheet = stylesheet_.sheet
    }
  }
}

const hyphenate = string =>
	string.replace(/([A-Z])/g, matched =>
    `-${matched.toLowerCase()}`
  )

const validCSSName = string =>
  string
    .toString()
    .replace(/[ ()%#,.]/g, '')

function createClassName(hyphenName, content, options) {
  return [
    options.prefix,
    hyphenName,
    validCSSName(content),
    options.suffix
  ].filter(key => key)
   .join('-')
}

function createClassBody(className, body, options) {
  const classNameAndSuffix = [
    className,
    options.suffix
  ].filter(elem => elem)
   .join(':')
  const css = `.${classNameAndSuffix} { ${body} }`
  if (options.surround) {
    return `${options.surround} { ${css} }`
  } else {
    return css
  }
}

function getClassName(style, content, options) {
  const hyphenName = hyphenate(style)
  const className = createClassName(hyphenName, content, options)
  if (!cache.has(className)) {
    const body = `${hyphenName}: ${content}`
    stylesheet.insertRule(createClassBody(className, body, options))
    cache.add(className)
  }
  return [ className ]
}

function cloneMedias(medias, news) {
  if (news.width && medias.width) {
    news.width.max = news.width.max || medias.width.max
    news.width.min = news.width.min || medias.width.min
  }
  if (medias.devices) {
    news.devices = medias.devices.concat(news.devices || [])
  }
  if (medias.suffix) {
    news.suffix = news.suffix || medias.suffix
  }
  return news
}

function createPrefixFromMedias(medias) {
  let name = []
  if (medias.width) {
    name.push('media')
    name.push('width')
    if (medias.width.max) {
      name.push('max')
      name.push(medias.width.max.toString())
    }
    if (medias.width.min) {
      name.push('min')
      name.push(medias.width.min.toString())
    }
  }
  if (medias.devices) {
    name = name.concat(medias.devices)
  }
  return name.join('-')
}

function createSurroundFromMedias(medias) {
  let result = []
  if (medias.devices) {
    result.push(medias.devices.join(', '))
  }
  if (medias.width) {
    if (medias.width.min) {
      result.push(`(min-width: ${medias.width.min})`)
    }
    if (medias.width.max) {
      result.push(`(max-width: ${medias.width.max})`)
    }
  }
  return `@media ${result.join(' and ')}`
}

const computeMediasWidth = medias => elem => {
  const max = elem.max
  const min = elem.min
  delete elem.max
  delete elem.min
  return getMediaQueryClassName(
    elem,
    cloneMedias(medias, { width: { max: max, min: min } })
  )
}

function computeSuffixOrBasicStyle(key, content, medias) {
  if (key === 'media') { throw 'MediaException' }
  const rule = content[key]
  if (typeof rule === 'object') {
    return getMediaQueryClassName(content[key], cloneMedias(medias, { suffix: key }))
  } else {
    return getClassName(key, rule, {
      prefix: createPrefixFromMedias(medias),
      suffix: medias.suffix,
      surround: createSurroundFromMedias(medias)
    })
  }
}

function getMediaQueryClassName(content, medias) {
  return Object
    .keys(content)
    .map(key => {
      switch (key) {
        case "widths":
          return content.widths
            .map(computeMediasWidth(medias))
            .reduce((acc, value) => acc.concat(value))
        case "screen":
          return getMediaQueryClassName(
            content.screen,
            cloneMedias(medias, { devices: [ 'screen' ] })
          )
        case "mobile":
          return getMediaQueryClassName(
            content.mobile,
            cloneMedias(medias, { devices: [ 'mobile' ] })
          )
        default: return computeSuffixOrBasicStyle(key, content, medias)
      }
    })
    .reduce((acc, value) => acc.concat(value), [])
}

function getClassNamesFromStyles(styles) {
  const media = styles.media
  if (media) { delete styles.media }
  return getMediaQueryClassName(styles, {})
}

function selectCorrectClassNames(classes, classNames) {
  return classes
    .split(' ')
    .filter(elem => !classNames.includes(elem))
    .concat(classNames)
    .filter(elem => elem !== '')
    .join(' ')
}

export default function h(tag, attributes, ...children) {
  setCorrectStylesheet()
  if (attributes) {
    const styles = attributes.style
    if (styles) {
      const classNames = getClassNamesFromStyles(styles)
      const classes = attributes.className || ''
      attributes.className = selectCorrectClassNames(classes, classNames)
    }
    if (attributes.inline) {
      attributes.style = attributes.inline
      delete attributes.inline
    } else if (styles) {
      delete attributes.style
    }
  }
  return render(tag, attributes, children)
}
