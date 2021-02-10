require "application_system_test_case"

class Aria::ExpanderControllerTest < ApplicationSystemTestCase
  test "expander toggles <details>" do
    visit aria_examples_path
    sleep 1

    assert_selector :disclosure_button, "Open Details", expanded: false

    toggle_disclosure("Open Details").then  { assert_selector :disclosure, text: "Details", expanded: true }
    toggle_disclosure("Open Details").then  { assert_selector :disclosure, text: "Details", expanded: false }
    toggle_disclosure("Summary").then       { assert_selector :disclosure_button, "Open Details", expanded: true }
  end

  test "expander toggles CSS class" do
    visit aria_examples_path
    sleep 1

    assert_no_selector "#css-class.expanded", text: "CSS class"
    assert_selector :disclosure_button, "Toggle CSS class", expanded: false

    click_on("Toggle CSS class").then { assert_selector "#css-class.expanded", text: "CSS class" }
    click_on("Toggle CSS class").then { assert_no_selector "#css-class.expanded", text: "CSS class" }
  end

  test "expander toggles hidden" do
    visit aria_examples_path
    sleep 1

    assert_text "Visible"
    assert_selector :disclosure_button, "Toggle Hidden", expanded: false

    click_on("Toggle Hidden").then { assert_no_text "Visible" }
    click_on("Toggle Hidden").then { assert_text "Visible" }
  end
end
