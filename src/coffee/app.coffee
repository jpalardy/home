
# attach sites to Command
Command.sites = sites
Command.default_sites = ['ddg']
Command.groups =
  images: ['yim','gim']
  anime:  ['ann','anidb']

reuse = false

setReuse = (value) ->
  reuse = value
  if reuse
    document.getElementById("command_input").className = "reuse"
  else
    document.getElementById("command_input").className = ""

handleForm = (form) ->
  try
    command_text = document.getElementById("command_input").value
    command = Command.parse(command_text)

    return if command.links.length is 0

    if reuse
      for url in command.urls.slice(1)
        window.open url, '_blank'
      window.location = command.urls[0]
    else
      for url in command.urls
        window.open url, '_blank'
  catch e
    console.log e

  false

handleGlobalKey = (event) ->
  if event.keyCode is 27
    elem = document.getElementById "cheatSheetDetails"
    elem.open = !elem.open

handleKey = (event) ->
  if event.charCode is 33 # char is "!"
    setReuse !reuse
    return false # don't print "!"
  else
    return true

#-------------------------------------------------

exports = exports ? this
exports.handleForm      = handleForm
exports.handleGlobalKey = handleGlobalKey
exports.handleKey       = handleKey

