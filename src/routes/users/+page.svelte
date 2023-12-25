<script lang="ts">
    import { goto } from "$app/navigation";
    import type { PageData } from "./$types";
    import { sendErrorToast, sendSuccessToast } from "$lib/utils";
    import { page } from "$app/stores";
    let selectValue = "Show All";
    let statusFilterValue: boolean = true;
    let usernameFilterValue: string;
    let emailFilterValue: string;
    let level: number = 1;
    let levelFilterValue: number;
    export let data: PageData;
    let filteredList = data["userList"];

    const setLevelFilterValue = (event) => {
        // only allow numbers
        const processedValue = event.target.value.replace(/\D/g, "");
        levelFilterValue = parseInt(processedValue);
        event.target.value = processedValue;
    };

    const refreshFilteredList = () => {
        if (selectValue === "Username") {
            filteredList = data["userList"].filter((user) =>
                user.username.includes(usernameFilterValue),
            );
        } else if (selectValue === "Email") {
            filteredList = data["userList"].filter((user) =>
                user.email.includes(emailFilterValue),
            );
        } else if (selectValue === "Level") {
            filteredList = data["userList"].filter(
                (user) => user.level === levelFilterValue,
            );
        } else if (selectValue === "Status") {
            filteredList = data["userList"].filter(
                (user) => user.banned === !statusFilterValue,
            );
        } else {
            filteredList = data["userList"];
        }
    };
</script>

<span class="font-bold ml-4 mr-4">Filters</span>
<select class="select max-w-xs select-accent" bind:value={selectValue}>
    <option>Show All</option>
    <option>Username</option>
    <option>Email</option>
    <option>Level</option>
    <option>Status</option>
</select>
{#if selectValue === "Username"}
    <input
        type="text"
        placeholder="gavin.belson"
        class="input input-bordered input-accent w-full max-w-xs"
        bind:value={usernameFilterValue}
    />{/if}
{#if selectValue === "Email"}
    <input
        type="text"
        placeholder="gavin.belson@ds.study.iitm.ac.in"
        class="input input-bordered input-accent w-full max-w-xs"
        bind:value={emailFilterValue}
    />
{/if}
{#if selectValue === "Level"}
    <input
        type="text"
        placeholder="1"
        class="input input-bordered input-accent w-min max-w-xs"
        on:input={setLevelFilterValue}
    />
{/if}
{#if selectValue === "Status"}
    {#if statusFilterValue === true}
        <button
            class="btn btn-success"
            on:click={() => {
                statusFilterValue = false;
                refreshFilteredList();
            }}>ACTIVE</button
        >
    {:else}
        <button
            class="btn btn-error"
            on:click={() => {
                statusFilterValue = true;
                refreshFilteredList();
            }}>BANNED</button
        >
    {/if}
{/if}
{#if selectValue !== "Show All" && selectValue !== "Status"}
    <button class="btn btn-accent" on:click={refreshFilteredList}>Apply</button>
{/if}
<br /><br />
<span class="ml-4 text-lg mt-4">
    Showing <b>{filteredList.length}</b> of <b>{data["userList"].length}</b>
    {#if data["userList"].length === 1}
        user.
    {:else}
        users.
    {/if}
    {#if selectValue !== "Show All"}
        <a
            class="link link-accent"
            on:click={() => {
                selectValue = "Show All";
                refreshFilteredList();
            }}>Reset Filters</a
        >
    {/if}
</span>
<div class="overflow-x-auto">
    <table class="table table-lg">
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
            {#each filteredList as user}
                <tr>
                    <td>
                        <div
                            class="tooltip cursor-pointer"
                            id={`username_${user.userId}`}
                            data-tip="Copy Username"
                            on:click={() => {
                                navigator.clipboard.writeText(user.username);
                                const tooltip = document.getElementById(
                                    `username_${user.userId}`,
                                );
                                tooltip?.setAttribute("data-tip", "Copied!");
                                setTimeout(() => {
                                    tooltip?.setAttribute(
                                        "data-tip",
                                        "Copy Username",
                                    );
                                }, 2000);
                            }}
                        >
                            {user.username}
                        </div>
                    </td>
                    <td
                        ><div
                            class="tooltip"
                            id={`email_${user.userId}`}
                            data-tip="Copy Email"
                            on:click={() => {
                                navigator.clipboard.writeText(user.email);
                                const tooltip = document.getElementById(
                                    `email_${user.userId}`,
                                );
                                tooltip?.setAttribute("data-tip", "Copied!");
                                setTimeout(() => {
                                    tooltip?.setAttribute(
                                        "data-tip",
                                        "Copy Email",
                                    );
                                }, 2000);
                            }}
                        >
                            {user.email}
                        </div></td
                    >
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
                            class="btn btn-primary font-bold"
                            id={`copy_${user.userId}`}
                            on:click={() => {
                                navigator.clipboard.writeText(user.userId);
                                const btn = document.getElementById(
                                    `copy_${user.userId}`,
                                );
                                btn.innerHTML = "Copied!";
                                btn?.classList.add("btn-success");
                                setTimeout(() => {
                                    btn.innerHTML = "Copy ID";
                                    btn?.classList.remove("btn-success");
                                }, 2000);
                            }}
                        >
                            Copy ID
                        </button>

                        <button
                            class="btn btn-secondary font-bold"
                            on:click={() => goto(`/logs/${user.userId}`)}
                            >View Logs</button
                        >
                        {#if user.banned}
                            <button
                                class="btn btn-success font-bold"
                                on:click={() => {
                                    const dialog = document.getElementById(
                                        `unban_${user.userId}`,
                                    );
                                    dialog.showModal();
                                }}>Unban</button
                            >
                            <dialog id={`unban_${user.userId}`} class="modal">
                                <div class="modal-box">
                                    <h3 class="font-bold text-lg">
                                        Confirm Unban
                                    </h3>
                                    <p class="py-4">
                                        Are you sure you want to unban <br />
                                        <kbd>{user.username}</kbd>?
                                    </p>
                                    <div class="modal-action">
                                        <form method="dialog">
                                            <!-- if there is a button in form, it will close the modal -->
                                            <button class="btn btn-neutral mr-4"
                                                >Cancel</button
                                            >
                                            <button
                                                class="btn btn-success"
                                                on:click={async () => {
                                                    const res = await fetch(
                                                        `/api/unban`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/json",
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    userId: user.userId,
                                                                },
                                                            ),
                                                        },
                                                    );
                                                    if (res.ok) {
                                                        sendSuccessToast(
                                                            "Success",
                                                            `${user.username} has been unbanned.`,
                                                        );
                                                        // window.location.reload();
                                                        user.banned = false;
                                                    } else {
                                                        sendErrorToast(
                                                            "Error",
                                                            `Failed to unban ${user.username}.`,
                                                        );
                                                    }
                                                }}>Unban User</button
                                            >
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        {:else}
                            <button
                                class="btn btn-error font-bold"
                                on:click={() => {
                                    const dialog = document.getElementById(
                                        `ban_${user.userId}`,
                                    );
                                    dialog.showModal();
                                }}>Ban</button
                            >
                            <dialog id={`ban_${user.userId}`} class="modal">
                                <div class="modal-box">
                                    <h3 class="font-bold text-lg">
                                        Confirm Ban
                                    </h3>
                                    <p class="py-4">
                                        Are you sure you want to ban <br />
                                        <kbd>{user.username}</kbd>?
                                    </p>
                                    <div class="modal-action">
                                        <form method="dialog">
                                            <!-- if there is a button in form, it will close the modal -->
                                            <button class="btn btn-neutral mr-4"
                                                >Cancel</button
                                            >
                                            <button
                                                class="btn btn-error"
                                                on:click={async () => {
                                                    const res = await fetch(
                                                        `/api/ban`,
                                                        {
                                                            method: "POST",
                                                            headers: {
                                                                "Content-Type":
                                                                    "application/json",
                                                            },
                                                            body: JSON.stringify(
                                                                {
                                                                    userId: user.userId,
                                                                },
                                                            ),
                                                        },
                                                    );
                                                    if (res.ok) {
                                                        sendSuccessToast(
                                                            "Success",
                                                            `${user.username} has been banned.`,
                                                        );
                                                        user.banned = true;
                                                    } else {
                                                        sendErrorToast(
                                                            "Error",
                                                            `Failed to ban ${user.username}.`,
                                                        );
                                                    }
                                                }}>Ban User</button
                                            >
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
