window.onload = () => {
    $("#btn-api").click(function () {
        let data = {
            address: $("#address").val()
        }

        let uri = "./api/get/" + data.address;

        window.location.href = uri;
    });
}