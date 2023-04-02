document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('eye1').addEventListener('click', () => {
        let input1 = document.getElementById("id_password");
        if (input1.type === "password") {
            input1.type = "text";
            document.getElementById("eye1").classList = "fas fa-eye-slash";
        }
        else {
            input1.type = "password";
            document.getElementById("eye1").classList = "fas fa-eye";
        }
    })
    document.getElementById('eye2').addEventListener('click', () => {
        let input2 = document.getElementById("id_password2");
        if (input2.type === "password") {
            input2.type = "text";
            document.getElementById("eye2").classList = "fas fa-eye-slash";
        }
        else {
            input2.type = "password";
            document.getElementById("eye2").classList = "fas fa-eye";
        }
    })
})