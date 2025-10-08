from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for console events and print them
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    try:
        # 1. Login
        page.goto("http://localhost:8000/login")
        page.fill("input[name='email']", "test@example.com")
        page.fill("input[name='password']", "password")
        page.click("button[type='submit']")
        expect(page).to_have_url("http://localhost:8000/dashboard")

        # 2. Navigate to Users page
        page.goto("http://localhost:8000/users")
        expect(page).to_have_url("http://localhost:8000/users")

        # 3. Create a new user
        page.click("button:has-text('Create User')")

        # Fill out the form in the modal
        modal = page.locator('div[role="dialog"]')
        expect(modal).to_be_visible()

        modal.fill("input[name='name']", "New User")
        modal.fill("input[name='email']", "new.user@example.com")
        modal.fill("input[name='password']", "password123")
        modal.click("button[type='submit']")

        # Wait for the modal to disappear and the new user to appear in the table
        expect(modal).not_to_be_visible()
        expect(page.locator("text=New User")).to_be_visible()

        # 4. Take a screenshot after creating the user
        page.screenshot(path="jules-scratch/verification/01_user_created.png")

        # 5. Edit the user
        page.locator('tr:has-text("new.user@example.com") button[aria-haspopup="menu"]').click()
        page.locator('div[role="menu"] >> text=Edit').click()

        # Fill out the form in the modal
        edit_modal = page.locator('div[role="dialog"]')
        expect(edit_modal).to_be_visible()
        edit_modal.fill("input[name='name']", "Updated User")
        edit_modal.click("button[type='submit']")

        # Wait for the modal to disappear and the updated user to appear in the table
        expect(edit_modal).not_to_be_visible()
        expect(page.locator("text=Updated User")).to_be_visible()

        # 6. Take a screenshot after editing the user
        page.screenshot(path="jules-scratch/verification/02_user_updated.png")

        # 7. Delete the user
        page.locator('tr:has-text("updated.user@example.com") button[aria-haspopup="menu"]').click()
        page.locator('div[role="menu"] >> text=Delete').click()

        delete_dialog = page.locator('div[role="dialog"]:has-text("Confirm Deletion")')
        expect(delete_dialog).to_be_visible()
        delete_dialog.click("button:has-text('Delete')")

        # Wait for the dialog to disappear and the user to be removed from the table
        expect(delete_dialog).not_to_be_visible()
        expect(page.locator("text=Updated User")).not_to_be_visible()

        # 8. Take a screenshot after deleting the user
        page.screenshot(path="jules-scratch/verification/03_user_deleted.png")

    finally:
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)