$(document).on("click", ".save-note", addNote);
$(document).on("click", ".delete-note", deleteNote);
$(document).on("click", ".scrape", resetScrape);

function addNote() {
  var thisId = $(this).attr("id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $(`input[data-value=title-${this.id}]`).val(),
      body: $(`input[data-value=body-${this.id}]`).val()
    }
  }).then(function(data) {
    location.reload();
    console.log(data);
  });
}

function deleteNote() {
  var thisId = $(this).attr("id");
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  }).then(function(data) {
    location.reload();
    console.log(data);
  });
}

function resetScrape() {
  $.ajax({
    method: "POST",
    url: "/scrape"
  }).then(function(data) {
    location.reload();
    console.log(data);
  });
}
