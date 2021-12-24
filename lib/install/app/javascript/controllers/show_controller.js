import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  confirm(event) {
    if (!confirm('Are you sure?')) event.preventDefault();
  }
}
