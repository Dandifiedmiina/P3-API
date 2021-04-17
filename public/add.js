window.onload = () => {
    $("#btn-api").click(function () {
        let data = {
            name: $("#name").val(),
            type: $("#type").val(),
            id: $("#id").val(),
            url: $("#url").val(),
            locale: $("#locale").val()
        }

        $.post("./api/add", data, function (data) {
            $("#response").html(data);
        });
    });
}