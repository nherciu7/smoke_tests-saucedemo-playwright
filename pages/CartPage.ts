import { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="cart-list"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }
  async navigate() {
    await this.page.goto("/cart.html");
  }

  async getTitle() {
    return await this.title.textContent();
  }

  async getCartItems() {
    const itemsCount = await this.cartItems.count();
    const items = [];
    for (let i = 0; i < itemsCount; i++) {
      items.push(await this.cartItems.nth(i).textContent());
    }
    return items;
  }

  getItemByName(name: string) {
    return this.page
      .locator('[data-test="inventory-item-name"]')
      .filter({ hasText: name });
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
