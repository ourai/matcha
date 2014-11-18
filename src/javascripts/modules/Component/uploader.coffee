$(document).on "change", hook("uploader.trigger"), ->
  ipt = $(this)
  label = $(hook("uploader.label"), ipt.closest(".Uploader"))
  files = this.files
  text = "No files selected"
  val = ipt.val()

  if files?
    label.text if files.length then files[0].name else text
  else
    label.text if val is "" then text else val

  return false
