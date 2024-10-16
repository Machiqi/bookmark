document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://crudcrud.com/api/268a39642d2c4cd3a23d680785ad27bd/bookmarks';
    const form = document.getElementById('bookmarkForm');
    const titleInput = document.getElementById('title');
    const urlInput = document.getElementById('url');
    const bookmarkIdInput = document.getElementById('bookmarkId');
    const cancelEditBtn = document.getElementById('cancelEdit');

    function addBookmark(bookmark) {
        axios.post(apiUrl, bookmark)
            .then(() => {
                getBookmarks();
                resetForm();
            })
            .catch(err => {
                console.error('Error adding bookmark:', err);
            });
    }

    function getBookmarks() {
        axios.get(apiUrl)
            .then(response => {
                displayBookmarks(response.data);
            })
            .catch(err => {
                console.error('Error fetching bookmarks:', err);
            });
    }

    function updateBookmark(id, updatedBookmark) {
        axios.put(`${apiUrl}/${id}`, updatedBookmark)
            .then(() => {
                getBookmarks();
                resetForm();
            })
            .catch(err => {
                console.error('Error updating bookmark:', err);
            });
    }

    function deleteBookmark(id) {
        axios.delete(`${apiUrl}/${id}`)
            .then(() => {
                getBookmarks();
            })
            .catch(err => {
                console.error('Error deleting bookmark:', err);
            });
    }

    function editBookmark(id, title, url) {
        titleInput.value = title;
        urlInput.value = url;
        bookmarkIdInput.value = id;
        form.querySelector('button[type="submit"]').textContent = 'Update Bookmark';
        cancelEditBtn.style.display = 'inline';
    }

    function resetForm() {
        titleInput.value = '';
        urlInput.value = '';
        bookmarkIdInput.value = '';
        form.querySelector('button[type="submit"]').textContent = 'Add Bookmark';
        cancelEditBtn.style.display = 'none';
    }

    function displayBookmarks(bookmarks) {
        const bookmarkList = document.getElementById('bookmarkList');
        if (!bookmarkList) return;

        bookmarkList.innerHTML = '';
        bookmarks.forEach(bookmark => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = bookmark.title;
            link.href = bookmark.url;
            link.target = '_blank';

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.onclick = () => editBookmark(bookmark._id, bookmark.title, bookmark.url);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteBookmark(bookmark._id);

            li.appendChild(link);
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            bookmarkList.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = titleInput.value;
        const url = urlInput.value;
        const bookmarkId = bookmarkIdInput.value;

        if (!title || !url) {
            console.error('Title or URL is missing');
            return;
        }

        const bookmark = { title, url };

        if (bookmarkId) {
            updateBookmark(bookmarkId, bookmark);
        } else {
            addBookmark(bookmark);
        }
    });

    cancelEditBtn.addEventListener('click', () => {
        resetForm();
    });

    getBookmarks();
});
