import { expect, test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import users from "../data/users.json";
import products from "../data/products.json";
import checkout from "../data/checkout.json";

test.describe("SauceDemo Login Scenarios", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("1.Login succesfully", async ({ page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);

    await expect(page).toHaveURL("/inventory.html");

    const inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.getTitle()).resolves.toBe("Products");
    await expect(inventoryPage.productItems).toBeVisible();
  });

  test("2.Login with invalid credentials", async () => {
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password,
    );

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(
      "Epic sadface: Username and password do not match any user in this service",
    );
  });

  test("3.Add product to cart and verify basket count", async ({ page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(products.backpack.id);

    const basketCount = await inventoryPage.getBasketCount();
    expect(basketCount).toBe("1");

    await page.locator(".shopping_cart_link").click();

    const cartPage = new CartPage(page);
    await expect(page).toHaveURL("/cart.html");
    await expect(cartPage.getItemByName(products.backpack.name)).toBeVisible();
  });

  test("4.Complete checkout", async ({ page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCart(products.backpack.id);

    await page.locator(".shopping_cart_link").click();

    const cartPage = new CartPage(page);
    await cartPage.checkout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo(
      checkout.customer.firstName,
      checkout.customer.lastName,
      checkout.customer.postalCode,
    );
    await checkoutPage.continue();
    await checkoutPage.finish();

    const confirmation = await checkoutPage.getConfirmationMessage();
    expect(confirmation).toBe("Thank you for your order!");
  });
});
