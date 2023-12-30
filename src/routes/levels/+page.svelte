<script lang="ts">
    import { collection, query, orderBy } from "firebase/firestore";
    import { DownloadURL, collectionStore } from "sveltefire";
    import { firestore } from "$lib/firebase";
    import { Download, Eye, EyeOff, Image, Link } from "lucide-svelte";
    import { sendErrorToast, sendSuccessToast } from "$lib/utils";
    const collectionRef = collection(firestore, "levels");
    const q = query(collectionRef, orderBy("createdAt", "asc"));
    const store = collectionStore(firestore, q);
    let showAnswers: boolean = false;
    let showImageID: string = "";
</script>

<span class="font-bold ml-4 mr-4">Settings</span><br /><br />
<div class="tooltip" data-tip={showAnswers ? "Hide Answers" : "Show Answers"}>
    <button
        class="btn ml-4"
        class:btn-error={showAnswers}
        class:btn-primary={!showAnswers}
        on:click={() => {
            showAnswers = !showAnswers;
        }}
    >
        {#if showAnswers}
            <Eye />
            Answers Shown
        {:else}
            <EyeOff />
            Answers Hidden
        {/if}
    </button>
</div>
<br />
<div class="overflow-x-auto">
    <table class="table">
        <!-- head -->
        <thead>
            <tr>
                <th></th>
                <th>Title</th>
                <th>Question</th>
                <th>Code Comment</th>
                <th>Files</th>
                <th>Images</th>
                <th>Answer</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each $store as level, index}
                <!-- row 1 -->
                <tr>
                    <th>{index + 1}</th>
                    <td>{level.title}</td>
                    <td>{level.prompt}</td>
                    <td
                        >{#if level.codeComment === undefined || level.codeComment === ""}<i
                                >No Code Comment</i
                            >{:else}{level.codeComment}{/if}</td
                    >
                    <td
                        ><div
                            class="badge badge-secondary cursor-pointer hover:badge-outline"
                            on:click={() => {
                                const modal = document.getElementById(
                                    `files_${level.levelId}`,
                                );
                                modal.showModal();
                            }}
                        >
                            {level.files.length}
                        </div></td
                    >
                    <!-- Open the modal using ID.showModal() method -->

                    <td
                        ><div
                            class="badge badge-secondary hover:badge-outline cursor-pointer"
                            on:click={() => {
                                const modal = document.getElementById(
                                    `images_${level.levelId}`,
                                );
                                modal.showModal();
                            }}
                        >
                            {level.images.length}
                        </div></td
                    >

                    <td class:blur={showAnswers === false}>{level.answer}</td>

                    <td>
                        <button
                            class="btn btn-error"
                            on:click={async () => {
                                const modal = document.getElementById(
                                    `delete_${level.levelId}`,
                                );
                                modal.showModal();
                            }}>Delete</button
                        >
                    </td>
                </tr>
                <!-- Deleted Dialog -->
                <dialog id={`delete_${level.levelId}`} class="modal">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Confirm Deletion</h3>
                        <p class="py-4">
                            Are you sure you want to delete the question?
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
                                            `/api/levels/${level.levelId}`,
                                            {
                                                method: "DELETE",
                                            },
                                        );
                                        if (res.ok) {
                                            sendSuccessToast(
                                                "Success",
                                                `Question has been deleted.`,
                                            );
                                            // window.location.reload();
                                        } else {
                                            sendErrorToast(
                                                "Error",
                                                `Failed to delete question.`,
                                            );
                                        }
                                    }}>Delete</button
                                >
                            </form>
                        </div>
                    </div>
                </dialog>
                <!-- Files LIst -->
                <dialog id={`files_${level.levelId}`} class="modal">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">File List</h3>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                        <th>Actions</th><data value=""></data>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- row 1 -->
                                    {#each level.files as file, index}
                                        <tr>
                                            <td>{file.name}</td>
                                            <td>
                                                <DownloadURL
                                                    ref={file.path}
                                                    let:link
                                                >
                                                    <button
                                                        class="btn btn-square"
                                                        on:click={() =>
                                                            open(link)}
                                                    >
                                                        <Download size="20px" />
                                                    </button>
                                                </DownloadURL>
                                            </td>
                                        </tr>
                                    {/each}
                                    <!-- row 2 -->
                                </tbody>
                            </table>
                        </div>
                        <div class="modal-action">
                            <form method="dialog">
                                <!-- if there is a button in form, it will close the modal -->
                                <button class="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                <!-- Images List -->
                <dialog id={`images_${level.levelId}`} class="modal">
                    <div class="modal-box">
                        <h3 class="font-bold text-lg">Images</h3>
                        <div class="overflow-x-auto">
                            <table class="table">
                                <!-- head -->
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- row 1 -->
                                    {#each level.images as image, index}
                                        <DownloadURL ref={image.path} let:link>
                                            <tr>
                                                <td>{image.name}</td>
                                                <td>
                                                    <button
                                                        class="btn btn-square"
                                                        class:btn-primary={showImageID ===
                                                            image.fileId}
                                                        on:click={() => {
                                                            if (
                                                                showImageID ===
                                                                image.fileId
                                                            ) {
                                                                showImageID =
                                                                    "";
                                                            } else {
                                                                showImageID =
                                                                    image.fileId;
                                                            }
                                                        }}
                                                    >
                                                        <Image size="20px" />
                                                    </button>
                                                    <!-- Open the modal using ID.showModal() method -->

                                                    <button
                                                        class="btn btn-square"
                                                        on:click={() =>
                                                            open(link)}
                                                    >
                                                        <Download size="20px" />
                                                    </button>
                                                </td>
                                                {#if showImageID === image.fileId}
                                                    <td>
                                                        <img
                                                            src={link}
                                                            alt="Image"
                                                            class="rounded-lg"
                                                        />
                                                    </td>
                                                {/if}
                                            </tr>
                                            <!-- svelte-ignore a11y-img-redundant-alt -->
                                        </DownloadURL>
                                    {/each}
                                    <!-- row 2 -->
                                </tbody>
                            </table>
                            <div class="modal-action">
                                <form method="dialog">
                                    <!-- if there is a button in form, it will close the modal -->
                                    <button class="btn">Close</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </dialog>

                <!-- <span>{count} Levels</span>
    {#each data as level}
        <span>{level.levelId}</span>
        <button
            class="btn btn-error"
            on:click={async () => {
                const r = await fetch(`/api/levels/${level.levelId}`, {
                    method: "DELETE",
                });
                if (r.ok) {
                    console.log("deleted");
                }
            }}>DELETE</button
        >
    {/each} -->
            {/each}
        </tbody>
    </table>
</div>
