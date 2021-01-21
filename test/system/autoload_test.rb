require "application_system_test_case"

class AutoloadTest < ApplicationSystemTestCase
  test "autoloads Controller modules on the page eagerly" do
    visit root_path(message: "Hello, from a System Test")

    within "#eager-loaded" do
      assert_text "Hello, from a System Test"
      assert_text "Namespace: Hello, from a System Test"
    end
  end

  test "autoloads Controller modules on the page lazily" do
    visit root_path(message: "Hello World!")

    within "#load-attribute" do
      assert_no_text "Hello World!"

      click_on("Load").then { assert_text "Hello World!" }
    end

    within "#load-descendant" do
      assert_no_text "Hello World!"

      click_on("Load").then { assert_text "Hello World!" }
    end
  end

  test "autoloads Controller modules when the page is navigated to" do
    visit no_controllers_path

    click_on "Load"
    within "#eager-loaded" do
      assert_text "Hello, from another page"
      assert_text "Namespace: Hello, from another page"
    end
  end

  test "autoloads Controller modules when the page is navigated to via Turbo" do
    visit turbo_path

    click_on "Load"
    within "#eager-loaded" do
      assert_text "Hello, from Turbo page"
      assert_text "Namespace: Hello, from Turbo page"
    end
  end
end
