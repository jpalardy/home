
# attach sites to Command
Command.sites = sites
Command.default_sites = ['ddg']
Command.groups =
  images: ['yim','gim']
  anime:  ['ann','anidb']

handleForm = (form) ->
  try
    command_text = document.getElementById("command_input").value
    command = Command.parse(command_text)

    return if command.links.length is 0

    for url in command.urls
      window.open url, '_blank'
  catch e
    console.log e

  false

handleGlobalKey = (event) ->
  if event.keyCode is 27
    elem = document.getElementById "cheatSheetDetails"
    elem.open = !elem.open

#-------------------------------------------------

exports = exports ? this
exports.handleForm      = handleForm
exports.handleGlobalKey = handleGlobalKey

