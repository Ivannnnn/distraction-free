const { h, Component, render, createRef } = preact
const createElements = (h => {
  const isObject = val => val !== null && val.constructor.name === 'Object'
  const isFunction = val => typeof val === 'function'
  const isArray = val => val.constructor.name === 'Array'
  const isString = val => typeof val === 'string'

  return new Proxy(
    {},
    {
      get(target, tagName) {
        return (...args) => {
          let attrs = {},
            children

          args.forEach(arg => {
            if (isFunction(arg) || isArray(arg)) {
              children = arg
            } else if (isObject(arg)) {
              Object.assign(attrs, arg)
            } else if (isString(arg)) {
              if (arg.startsWith('.')) {
                attrs.className = arg.slice(1)
              } else if (arg.startsWith('#')) {
                attrs.id = arg.slice(1)
              } else {
                children = arg
              }
            }
          })

          return h(tagName, attrs, children)
        }
      }
    }
  )
})(h)
const { div, label, h2, h3, input } = createElements

class Option extends Component {
  render() {
    return div([
      label([
        this.props.label,
        h(input, {
          type: 'checkbox',
          checked: this.props.checked,
          onChange: e => this.props.onChange(e.target.checked)
        })
      ])
    ])
  }
}

const defaultOptions = {
  reddit: {
    newfeed: false,
    growing_communities: false,
    premium: false,
    trending: false,
    recent: false
  },
  twitter: {
    newfeed: false,
    who_to_follow: false,
    trending: false
  },
  facebook: {
    newsfeed: false,
    group_recommendations: false
    //ads: false
  },
  youtube: {
    recommended: false,
    up_next: false,
    related: false,
    comments: false,
    ads: false
  },
  linkedin: {
    newsfeed: false
  }
}

class Options extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      options: {}
    }

    chrome.storage.sync.get('options', ({ options = {} }) => {
      this.setState({
        loaded: true,
        options: {
          reddit: { ...defaultOptions.reddit, ...options.reddit },
          facebook: { ...defaultOptions.facebook, ...options.facebook },
          twitter: { ...defaultOptions.twitter, ...options.twitter },
          youtube: { ...defaultOptions.youtube, ...options.youtube },
          linkedin: { ...defaultOptions.linkedin, ...options.linkedin }
        }
      })
    })
  }

  onChange(host, option, checked) {
    this.setState(
      {
        ...this.state,
        options: {
          ...this.state.options,
          [host]: {
            ...this.state.options[host],
            [option]: checked
          }
        }
      },
      () => chrome.storage.sync.set({ options: this.state.options })
    )
  }

  render() {
    return (
      this.state.loaded &&
      div([
        h2('Options'),
        Object.keys(this.state.options).map(host => {
          return div([
            h3(host),
            ...Object.keys(this.state.options[host]).map(option => {
              return h(Option, {
                label: option,
                checked: this.state.options[host][option],
                onChange: c => this.onChange(host, option, c)
              })
            })
          ])
        })
      ])
    )
  }
}

render(h(Options), document.querySelector('#root'))
