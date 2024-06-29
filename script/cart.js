/*四、購物車頁面*/
const memberSelect = document.querySelector("#memberSelect");
const quantityInputs = document.querySelectorAll(".tr_style2 input[type='number']");
const totalPriceCells = document.querySelectorAll(".tr_style2 td:last-child");
const totalAmountCell = document.querySelector("#totalAmount");
const submitButton = document.querySelector(".sent input[type='button']");

// 從localStorage中獲取會員帳號列表
const userData = JSON.parse(localStorage.getItem("userData")) || [];
userData.forEach(user => {
    const option = document.createElement("option");
    option.value = user.Account;
    option.textContent = user.Account;
    memberSelect.appendChild(option);
});

// 計算單個商品總價和總金額
function calculateTotal() {
    let totalAmount = 0;
    quantityInputs.forEach((input, index) => {
        let quantity = parseInt(input.value, 10);
        if (isNaN(quantity) || quantity < 0) {
            quantity = 0;
            input.value = 0;
        }
        const price = parseInt(input.parentElement.previousElementSibling.textContent, 10);
        const totalPrice = quantity * price;
        totalPriceCells[index].textContent = totalPrice;
        totalAmount += totalPrice;
    });
    totalAmountCell.textContent = `總金額：${totalAmount}`;
}

// 綁定事件監聽器
quantityInputs.forEach(input => {
    input.addEventListener("input", calculateTotal);
});

// 將購物車資料儲存到localStorage
submitButton.addEventListener("click", function() {
    const selectedAccount = memberSelect.value;
    if (selectedAccount === "請選擇") {
        alert("請選擇帳號");
        return;
    }

    const cartData = [];
    quantityInputs.forEach((input, index) => {
        const productName = input.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        const price = parseInt(input.parentElement.previousElementSibling.textContent, 10);
        const quantity = parseInt(input.value, 10) || 0;
        const totalPrice = parseInt(totalPriceCells[index].textContent, 10);

        if (quantity > 0) {
            cartData.push({ productName, price, quantity, totalPrice, currentDate, ticketNumber });
        }
    });

    if (cartData.length === 0) {
        alert("請至少選擇一件商品");
        return;
    }

    let cartStorage = JSON.parse(localStorage.getItem("cartData")) || {};
    cartStorage[selectedAccount] = cartData;
    localStorage.setItem("cartData", JSON.stringify(cartStorage));

    alert("購物車資料已儲存");
    location.reload(); // 重新載入頁面
});