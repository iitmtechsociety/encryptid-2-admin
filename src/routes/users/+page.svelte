<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<div class="overflow-x-auto">
    <table class="table">
        <!-- head -->
        <thead>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Level</th>
                <th>Points</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each data["userList"] as user}
                <tr>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>Level {user.level}</td>
                    <td>{user.points} PTS</td>
                    <td>
                        {#if user.banned === true}
                            <div class="badge badge-accent badge-outline">
                                BANNED
                            </div>
                        {:else}
                            <div class="badge badge-primary badge-outline">
                                ACTIVE
                            </div>
                        {/if}
                    </td>
                    <td>
                        <button
                            class="btn btn-secondary"
                            on:click={() => goto(`/logs/${user.userId}`)}
                            >Logs</button
                        >
                        <button
                            class="btn btn-error"
                            on:click={() => {
                                const dialog = document.getElementById(
                                    `delete_${user.userId}`,
                                );
                                dialog.showModal();
                            }}>Ban</button
                        >
                    </td>
                </tr>
                <dialog id={`delete_${user.userId}`} class="modal">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Confirm Ban</h3>
                        <p class="py-4">
                            Are you sure you want to ban <br />
                            <kbd>{user.username}</kbd>?
                        </p>
                        <div class="modal-action">
                            <form method="dialog">
                                <!-- if there is a button in form, it will close the modal -->
                                <button class="btn btn-primary">Cancel</button>
                                <button class="btn btn-error" on:click={
                                    
                                }>Ban User</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            {/each}
        </tbody>
    </table>
</div>
