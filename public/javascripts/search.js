/**
 * Provides search functions in javascript
 *
 * @class search
 */


/**
 * Submit a search query with a specific text string. Uses the
 *
 * @method submitSearch
 * @param {String} text Search query
 */
function submitSearch(text) {
    $('#trending_posts').html("")
    events.search(text)
}
