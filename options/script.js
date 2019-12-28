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
const { div, label, h2, input } = createElements



class Field extends Component {
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

class Options extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      options: {}
    }

    chrome.storage.sync.get('options', ({ options = {} }) => {
      this.setState({ options, loaded: true })
    })
  }

  onChange(option, checked) {
    this.setState(
      {
        ...this.state,
        options: {
          ...this.state.options,
          [option]: checked
        }
      },
      () => chrome.storage.sync.set({ options: this.state.options })
    )
  }

/*
  posts: '.rpBJOHq2PR60pnwJlUyP0',
  growing_communities: '._3RPJ8hHnfFohktLZca18J6',
  premium: '._1G4yU68P50vRZ4USXfaceV',
  trending: '._2j6XpwwZyn7dNcfH7Blz0B',
  recent: '._3Im6OD67aKo33nql4FpSp_'
*/



  render() {
    const { reddit, twitter } = this.state.options

    return (
      this.state.loaded &&
      div([
        h2('Options'),
        h(Field, {
          label: 'Twitter',
          checked: twitter,
          onChange: c => this.onChange('twitter', c)
        })
      ])
    )
  }
}

render(h(Options), document.querySelector('#root'))
