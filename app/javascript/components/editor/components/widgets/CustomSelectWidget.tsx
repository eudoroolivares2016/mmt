/* eslint-disable react/jsx-indent */
/* eslint-disable react/require-default-props */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'
import Select from 'react-select'
import { kebabCase } from 'lodash'
import { observer } from 'mobx-react'
import { EnumOptionsType, RJSFSchema, WidgetProps } from '@rjsf/utils'
import { JSONSchema7 } from 'json-schema'
import './Widget.css'
import { parseCmrResponse } from '../../utils/cmr_keywords'
import Status from '../../model/Status'

interface CustomSelectWidgetProps extends WidgetProps {
  label: string,
  options: {
    title?: string,
    enumOptions?: EnumOptionsType<RJSFSchema>[]
  },
  value: string,
  placeholder: string,
  isLoading: boolean,
  required: boolean,
  onChange: (value: string) => void,
  disabled: boolean,
  uiSchema?: any
}

type CustomSelectWidgetState = {
  setFocus: boolean
  loading: boolean
}
type SelectOptions = {
  value: string,
  label: string

}

class CustomSelectWidget extends React.Component<CustomSelectWidgetProps, CustomSelectWidgetState> {
  // eslint-disable-next-line react/static-property-placement
  selectScrollRef: React.RefObject<HTMLDivElement>
  constructor(props: CustomSelectWidgetProps) {
    super(props)
    this.selectScrollRef = React.createRef()
    this.state = { setFocus: false, loading: false }

    this.onHandleFocus = this.onHandleFocus.bind(this)
    this.onHandleChange = this.onHandleChange.bind(this)
    this.onHandleBlur = this.onHandleBlur.bind(this)
  }

  componentDidMount() {
    const { uiSchema = {}, schema } = this.props
    const service = uiSchema['ui:service']
    const controlled = uiSchema['ui:controlled'] || {}
    const { name, controlName } = controlled

    if (name && controlName) {
      this.setState({ loading: true }, () => {
        service.fetchCmrKeywords(name).then((keywords) => {
          const paths = parseCmrResponse(keywords, controlName)
          const enums = paths.map((path:string[]) => (path[0]))
          schema.enum = enums
          this.setState({ loading: false })
        })
          .catch(() => {
            const { registry } = this.props
            const { formContext } = registry
            const { editor } = formContext
            this.setState({ loading: false })
            editor.status = new Status('warning', `Error retrieving ${name} keywords`)
          })
      })
    }
  }

  onHandleFocus() {
    this.setState({ setFocus: true })
  }
  onHandleChange(e) {
    const { onChange } = this.props
    const { value } = e
    onChange(value)
  }
  onHandleBlur() {
    this.setState({ setFocus: false })
  }

  render() {
    const selectOptions: SelectOptions[] = []
    const { setFocus, loading } = this.state
    const {
      required, label, schema, options = { enumOptions: null }, registry, isLoading = loading, disabled, id
    } = this.props
    let {
      placeholder
    } = this.props
    const { schemaUtils, formContext } = registry
    const { items = {} } = schema
    const retrievedSchema = schemaUtils.retrieveSchema(items as JSONSchema7)

    const { value } = this.props
    const { title = label, enumOptions } = options
    const { editor } = formContext
    const listOfEnums = schema.enum ? schema.enum : []

    if (listOfEnums.length === 0 && retrievedSchema.enum) {
      retrievedSchema.enum.forEach((currentEnum: string) => {
        listOfEnums.push(currentEnum)
      })
    }
    selectOptions.push({ value: null, label: '✓' })

    listOfEnums.forEach((currentEnum: string) => {
      if (currentEnum) {
        selectOptions.push({ value: currentEnum, label: currentEnum })
      }
    })
    const existingValue = value != null ? { value, label: value } : {}
    const { focusField } = editor
    let shouldFocus = false

    if (editor?.focusField === id) {
      shouldFocus = true
    } else if (editor.focusField && id.match(/^\w+_\d+$/)) {
      if (id !== '' && id.startsWith(editor?.focusField)) {
        shouldFocus = true
      }
    }
    if (shouldFocus) {
      this.selectScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (!placeholder) {
      placeholder = `Select ${title}`
    }

    return (
      <div className="custom-select-widget" data-testid={`custom-select-widget__${kebabCase(label)}`} ref={this.selectScrollRef}>
        <div>
          <span>
            {title}
            {required && title ? <i className="eui-icon eui-required-o required-icon" /> : ''}
          </span>
        </div>
        <div className="widget-description" data-testid={`custom-select-widget__${kebabCase(label)}--description`}>
          <span>
            {setFocus ? schema.description : null}
          </span>
        </div>
        <div data-testid={`custom-select-widget__${kebabCase(label)}--selector`}>
          <Select
            key={`${id}_${focusField}`}
            autoFocus={shouldFocus}
            id={id}
            data-testid={`custom-select-widget__${kebabCase(label)}--select`}
            defaultValue={existingValue.value ? existingValue : null}
            // @ts-ignore
            options={enumOptions ?? selectOptions}
            placeholder={placeholder}
            isLoading={isLoading}
            isDisabled={disabled}
            onFocus={this.onHandleFocus}
            onChange={this.onHandleChange}
            onBlur={this.onHandleBlur}
          />
        </div>
      </div>
    )
  }
}
export default observer(CustomSelectWidget)
