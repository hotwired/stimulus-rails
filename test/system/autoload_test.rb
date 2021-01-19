require "application_system_test_case"

class AutoloadTest < ApplicationSystemTestCase
  test "autoloads Controller modules on the page" do
    visit root_path(message: "Hello, from a System Test")

    assert_text "Hello, from a System Test"
    assert_text "Namespace: Hello, from a System Test"
  end
end
