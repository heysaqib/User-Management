//delete user
function deleteUser(userId) {
    fetch(`/admin/users/${userId}`, { method: 'DELETE' })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to delete user');
        }
      })
      .then(data => {
        alert(data.message);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the user');
      });
  }

//edit user  
  function editUser(userId) {
    window.location.href = `/admin/users/${userId}/edit`;
  }
  
//CreateUser
  function createUser(){
    window.location.href="/admin/createUser";
  }  
  
//search user  
  function searchUsers() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.getElementsByTagName('tr');
  
    for (let i = 1; i < tableRows.length; i++) {
      const nameCell = tableRows[i].getElementsByTagName('td')[0];
      const emailCell = tableRows[i].getElementsByTagName('td')[1];
  
      if (
        nameCell.innerText.toLowerCase().includes(searchInput) ||
        emailCell.innerText.toLowerCase().includes(searchInput)
      ) {
        tableRows[i].style.display = '';
      } else {
        tableRows[i].style.display = 'none';
      }
    }
  }