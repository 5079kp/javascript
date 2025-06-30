function takeOrder() {
      let total = 0;
      let order = "";
      let ordering = true;

      while (ordering) {
        let choice = prompt("🍽️ MENU:\n1. Pizza - ₹150\n2. Burger - ₹100\n3. Sandwich - ₹80\n4. Cold Drink - ₹40\n5. Finish Order\n\nEnter item number (1-5):");

        if (choice === null) {
          ordering = false;
          break;
        }

        switch (choice) {
          case '1':
            total += 150;
            order += "🍕 Pizza - ₹150\n";
            break;

          case '2':
            total += 100;
            order += "🍔 Burger - ₹100\n";
            break;

          case '3':
            total += 80;
            order += "🥪 Sandwich - ₹80\n";
            break;

          case '4':
            total += 40;
            order += "🥤 Cold Drink - ₹40\n";
            break;

          case '5':
            ordering = false;
            break;

          default:
            alert("❌ Invalid choice! Please enter a number between 1 and 5.");
        }
      }

      const resultBox = document.getElementById("result");
      const orderDetails = document.getElementById("orderDetails");
      const totalAmount = document.getElementById("totalAmount");

      if (total > 0) {
        orderDetails.textContent = order;
        totalAmount.textContent = total;
        resultBox.style.display = "block";
      } else {
        orderDetails.textContent = "😕 No items were ordered.";
        totalAmount.textContent = "0";
        resultBox.style.display = "block";
      }
    }