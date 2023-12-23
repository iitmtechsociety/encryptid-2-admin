<script lang="ts">
    import '../app.css';
    import {BarChart, Shield, PersonStanding, Lock} from 'lucide-svelte';
    import {page} from '$app/stores';
    import {FirebaseApp} from 'sveltefire';
    import { auth, firestore, storage, rtdb } from '$lib/firebase';
    import { FlatToast, ToastContainer } from 'svelte-toasts';

</script>
<ToastContainer placement="top-right" let:data>
	<FlatToast {data} />
	<!-- Provider template for your toasts -->
</ToastContainer>
<FirebaseApp  {auth} {storage} {firestore} {rtdb}>
<div class="navbar bg-base-100">

      <a href="/" class="btn btn-ghost text-2xl">EncryptID Admin Panel</a>
 
    <ul class="menu bg-base-200 menu-horizontal rounded-box">
        <li>
          <a href="/metrics" class:active={$page.route.id?.match(/metrics/g)}>
            <BarChart/> 
            Metrics
            
          </a>
        </li>
        <li>
          <a href="/levels" class:active={$page.route.id?.match(/levels/g)}>
            <Shield/>
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
                <Lock/>
              Logs
              
            </a>
          </li>
      </ul>
</div>

 <br/>
<slot/>
</FirebaseApp>