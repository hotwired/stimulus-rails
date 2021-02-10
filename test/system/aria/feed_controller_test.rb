require "application_system_test_case"

class Aria::FeedControllerTest < ApplicationSystemTestCase
  test "articles in the feed can be navigated with the keyboard" do
    visit aria_examples_path
    sleep 1

    click_on("Skip to #feed")
    send_keys(:tab).then              { assert_selector "article", text: "First article", focused: true }
    send_keys(:page_down).then        { assert_selector "article", text: "Second article", focused: true }
    send_keys([:control, :end]).then  { assert_selector "article", text: "Third article", focused: true }
    send_keys(:page_up).then          { assert_selector "article", text: "Second article", focused: true }
    send_keys([:control, :home]).then { assert_selector "article", text: "First article", focused: true }

    append_article("Fourth article", into: "feed")

    send_keys([:control, :end]).then   { assert_selector "article", text: "Fourth article", focused: true }
  end

  private

    def append_article(text, into:)
      execute_script <<~JS, into, text
        const [ id, text] = arguments
        document.getElementById(id).insertAdjacentHTML("beforeend", `<article>${text}</article>`)
      JS
    end
end
