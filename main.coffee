#----------
#  whaaa?
#----------

nextContextId = 0
currentContext = null


class Context

    constructor: (@template) ->
        @id = nextContextId
        nextContextId += 1

        @cssId = "pretty_random_#{@id}"
        @isValid = yes

        currentContext = @

    invalidate: ->
        @isValid = no
        $("##{@cssId}").replaceWith(render(@template))

    render: ->
        "<div id='#{@cssId}'>#{@template()}</div>"


class Model

    constructor: (@attributes) ->
        @contextsByKey = {}

    get: (key) ->
        (@contextsByKey[key] ?= []).push(currentContext)
        @attributes[key]

    set: (key, value) ->
        @attributes[key] = value

        for context in @contextsByKey[key]
            if context.isValid
                context.invalidate()

        # removing invalidated contexts from `@contextsByKey` is...
        # "left as an exercise for the reader"

        return null


render = (template) ->
    context = new Context(template)
    context.render()


#---------
#  model
#---------

author = new Model
    firstName: 'Maciej'
    lastName: 'Konieczny'
    twitterName: 'narfdotpl'


#-------------
#  templates
#-------------

fullNameTemplate = ->
    console.log('rendering full name template')
    firstName = author.get('firstName')
    lastName = author.get('lastName')
    "#{firstName} #{lastName}"

twitterNameTemplate = ->
    console.log('rendering twitter name template')
    twitterName = author.get('twitterName')
    "(<a href='https://twitter.com/#{twitterName}'>@#{twitterName}</a>)"


#-------
#  DOM
#-------

fullNameHtml = render(fullNameTemplate)
twitterNameHtml = render(twitterNameTemplate)

$('#signature')
    .append(fullNameHtml)
    .append(twitterNameHtml)


#------------
#  "export"
#------------

window.author = author
