$(document).on("click", ".savenote", addNote);
function addNote() {
  console.log("something works");
  var noteTitle = $(`input[data-value=title-${this.id}]`).val();
  var noteBody = $(`input[data-value=body-${this.id}]`).val();
  console.log(noteBody);
  console.log(noteTitle);

  var thisId = $(this).attr("id");
  console.log(thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $(`input[data-value=title-${this.id}]`)
        .val()
        .trim(),
      // Value taken from note textarea
      body: $(`input[data-value=body-${this.id}]`)
        .val()
        .trim()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
    });
}
