<script lang="ts">
  import "../app.css";
  import {
    BarChart,
    Shield,
    PersonStanding,
    Lock,
    Plus,
    XCircle,
  } from "lucide-svelte";
  import { page } from "$app/stores";
  import { FirebaseApp } from "sveltefire";
  import { auth, firestore, storage, rtdb } from "$lib/firebase";
  import { FlatToast, ToastContainer } from "svelte-toasts";

  let files: FileList = [];
  let images: FileList = [];
  let codeComment = "";
  let title = "";
  let prompt = "";

  const setTitle = (event) => {
    title = event.target.value;
  };
  const setPrompt = (event) => {
    prompt = event.target.value;
  };
  const setCodeComment = (event) => {
    codeComment = event.target.value;
  };

  const createQuestion = () => {
    if (!title || !prompt) {
      return;
    }
    const question = {
      title,
      prompt,
      codeComment,
      files,
      images,
    };
    console.log(question);
  };
</script>

<ToastContainer placement="top-left" let:data>
  <FlatToast {data} />
  <!-- Provider template for your toasts -->
</ToastContainer>
<FirebaseApp {auth} {storage} {firestore} {rtdb}>
  <div class="navbar bg-base-100">
    <a href="/" class="btn btn-ghost text-2xl">EncryptID Admin Panel</a>
    <ul class="menu bg-base-200 menu-horizontal rounded-box">
      <li>
        <a href="/metrics" class:active={$page.route.id?.match(/metrics/g)}>
          <BarChart />
          Metrics
        </a>
      </li>
      <li>
        <a href="/levels" class:active={$page.route.id?.match(/levels/g)}>
          <Shield />
          Levels
        </a>
      </li>
      <li>
        <a href="/users" class:active={$page.route.id?.match(/users/g)}>
          <PersonStanding />
          Users
        </a>
      </li>
      <li>
        <a href="/logs" class:active={$page.route.id?.match(/logs/g)}>
          <Lock />
          Logs
        </a>
      </li>
    </ul>
    {#if $page.route.id?.match(/levels/g)}
      <button
        class="btn btn-primary btn-outline ml-4"
        on:click={() => {
          const modal = document.getElementById("new_level_modal");
          modal.showModal();
        }}
      >
        <Plus />
        Create Level
      </button>
    {/if}
  </div>
  <!-- Open the modal using ID.showModal() method -->
  <dialog id="new_level_modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">New Level</h3>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text"
            >Question Title <span class="text-red-400">*</span>
          </span>
        </div>
        <input
          type="text"
          placeholder="Title"
          class="input input-bordered w-full max-w-xs"
          on:input={setTitle}
        />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text"
            >Question Prompt <span class="text-red-400">*</span></span
          >
        </div>
        <input
          type="text"
          placeholder="Prompt"
          class="input input-bordered w-full max-w-xs"
          on:input={setPrompt}
        />
      </label>
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Files</span>
        </div>
        <input
          type="file"
          class="file-input file-input-bordered w-full max-w-xs"
          multiple
          bind:files
        />
      </label>
      {#each files as file, index}
        <div
          class="flex flex-row mt-2 font-mono"
          on:click={() => {
            files = [...files].filter((_, i) => i !== index);
          }}
        >
          <XCircle class="cursor-pointer text-red-400 mr-2" />
          {file.name}
        </div>
      {/each}
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Images</span>
        </div>
        <input
          type="file"
          class="file-input file-input-bordered w-full max-w-xs"
          bind:files={images}
          multiple
        />
      </label>
      {#each images as image, index}
        <div
          class="flex flex-row mt-2 font-mono"
          on:click={() => {
            images = [...images].filter((_, i) => i !== index);
          }}
        >
          <XCircle class="cursor-pointer text-red-400 mr-2" />
          {image.name}
        </div>
      {/each}
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Code Comment</span>
        </div>
        <input
          type="text"
          placeholder="Code Comment"
          class="input input-bordered w-full max-w-xs"
          on:input={setCodeComment}
        />
      </label>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->

          <button class="btn btn-neutral">Close</button>
          <button class="btn btn-primary font-bold">Create</button>
        </form>
      </div>
    </div>
  </dialog>
  <br />
  <slot />
</FirebaseApp>
