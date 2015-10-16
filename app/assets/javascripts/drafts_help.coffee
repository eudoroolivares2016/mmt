$(document).ready ->

  $('.display-help-modal').leanModal
    top: 200
    overlay: 0.6
    closeButton: '.modal-close'

  $('i.fa-info-circle').on 'click', (element) ->
    # get path from data-help-path attribute
    # properties/EntryId
    # definitions/ProcessingLevelType/properties/ProcessingLevelDescription
    helpPath = $(element.target).data('helpPath').split('/')
    title = fixTitle(helpPath[..].pop())
    minItems = getMinItems(helpPath)
    minLength = getMinLength(helpPath)
    maxLength = getMaxLength(helpPath)
    pattern = getPattern(helpPath)
    description = getDescription(helpPath)
    format = getFormat(helpPath)

    # Set the field title and description
    $('#help-modal .title').text(title)
    $('#help-modal .description').text(description)
    $('#help-modal .validations').html('')

    # Display or hide validation hints
    validations = $('#help-modal .validations')
    $(validations).parent().show()
    $("<li>Format: #{format}</li>").appendTo(validations) if format?
    $("<li>Minimum Items: #{minItems}</li>").appendTo(validations) if minItems?
    $("<li>Minimum Length: #{minLength}</li>").appendTo(validations) if minLength?
    $("<li>Maximum Length: #{maxLength}</li>").appendTo(validations) if maxLength?
    $("<li>Pattern: #{pattern}</li>").appendTo(validations) if pattern?
    if !format? and !minItems? and !minLength? and !maxLength? and !pattern?
      $(validations).parent().hide()

  fixTitle = (title) ->
    newTitle = switch title
      when 'URLs' then 'URLs'
      when 'StateProvince' then 'State / Province'
      else title.replace( /([A-Z])/g, " $1" )

    newTitle

  getSchemaProperties = (path) ->
    schema = globalJsonSchema
    schema = schema[x] for x in path
    schema

  getDescription = (path) ->
    schema = getSchemaProperties(path)
    schema.description

  getMinItems = (path) ->
    schema = getSchemaProperties(path)
    minItems = if schema.minItems? then schema.minItems else null
    if !minItems? and schema['$ref']?
      ref = schema['$ref'].split('/')
      ref.shift()
      minItems = getMinItems(ref)

    minItems

  getMinLength = (path) ->
    schema = getSchemaProperties(path)
    minLength = schema.minLength
    if !minLength? and schema['$ref']?
      ref = schema['$ref'].split('/')
      ref.shift()
      minLength = getMinLength(ref)

    minLength

  getMaxLength = (path) ->
    schema = getSchemaProperties(path)
    maxLength = schema.maxLength
    if !maxLength? and schema['$ref']?
      ref = schema['$ref'].split('/')
      ref.shift()
      maxLength = getMaxLength(ref)

    maxLength

  getPattern = (path) ->
    schema = getSchemaProperties(path)
    pattern = schema.pattern
    if !pattern? and schema['$ref']?
      ref = schema['$ref'].split('/')
      ref.shift()
      pattern = getPattern(ref)

    pattern

  getFormat = (path) ->
    schema = getSchemaProperties(path)
    format = schema.format
    if !format? and schema['$ref']?
      ref = schema['$ref'].split('/')
      ref.shift()
      format = getFormat(ref)

    format = "date-time (yyyy-MM-dd'T'HH:mm:ssZ)" if format == 'date-time'
    format
