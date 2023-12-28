<script lang="ts">
	import { onMount } from 'svelte';
	import { io, Socket } from 'socket.io-client';

	let elemChat: HTMLElement;
	let currentMessage = '';
	let username = ''; // Added username input field

	// Initialize with an empty message feed
	let messageFeed: ChatMessage[] = []; //
	interface ChatMessage {
		username: string;
		message: string;
		timestamp: string;
		host: boolean;
		name: string;
		color: string;
		room: string;
	}

	let socket: Socket;

	onMount(() => {
		socket = io('http://localhost:3000');

		// Listen for 'chat message' event from the server
		socket.on('chat message', (message) => {
			messageFeed = [...messageFeed, message];
			scrollChatBottom('smooth');
		});
	});

	function addMessage(): void {
		if (currentMessage.trim() !== '') {
			const newMessage = {
				username, // Assuming 'username' holds the current user's name
				message: currentMessage,
				timestamp: new Date().toLocaleString(),
				host: true, // Assuming the user sending the message is the 'host'
				name: username, // Assign the username to the 'name' property
				color: '', // Set the color property if needed
				room: selectedRoom
			};

			// Emit 'chat message' event to the server with the new message
			socket.emit('chat message', newMessage);
			currentMessage = ''; // Clear the message input field
		}
	}

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}

	let showChat = false; // Initially, don't show the chat interface
	let joinedUsers: string[] = [];

	function startChat(): void {
		if (username.trim() !== '' && selectedRoom !== '') {
			showChat = true;
			joinedUsers = [...joinedUsers, username];

			// Emit a welcome message to the server for the specific room
			const welcomeMessage = {
				username: 'Coders-Connect',
				message: `${username} ! joined the chat in ${selectedRoom} Room`,
				timestamp: new Date().toLocaleString(),
				host: true,
				name: 'Coders-Connect',
				color: '',
				room: selectedRoom // Include the room information in the welcome message
			};

			socket.emit('chat message', welcomeMessage);
		}
	}

	function leaveChat(): void {
		// Find the index of the current user in the joinedUsers array
		const userIndex = joinedUsers.findIndex((user) => user === username);

		if (userIndex !== -1) {
			// Remove the user from the joinedUsers array
			joinedUsers = joinedUsers.filter((_, index) => index !== userIndex);
			showChat = false; // Hide the chat interface

			// Remove messages sent by the leaving user from the messageFeed array
			messageFeed = messageFeed.filter((message) => message.username !== username);
		}
	}
	let selectedRoom = ''; // Variable to store the selected room

	// Function to join the chat room
	function joinChatRoom(room: string): void {
		if (username.trim() !== '' && room !== '') {
			selectedRoom = room;
			startChat();
		}
	}
</script>

<!-- //////////////////////////////////////////////////////////////////////////////////////////////////////////////////-->
{#if !showChat}
	<div class="flex flex-col items-center justify-center h-screen">
		<!-- Username input -->
		<div class="mb-3">
			<input
				bind:value={username}
				class="rounded border p-2 text-black"
				type="text"
				placeholder="Enter your name"
			/>
			<!-- Room selection dropdown -->
			<select bind:value={selectedRoom} class="rounded border px-8 text-black">
				<option value="">Select Room</option>
				<option value="General">General</option>
				<option value="Projects">Projects</option>
				<option value="Ui-Ux">Ui-Ux</option>
				<option value="Svelte Training">Svelte Training</option>

				<!-- Add more rooms as needed -->
			</select>
			<button
				on:click={() => joinChatRoom(selectedRoom)}
				class="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
			>
				Join Chat
			</button>
		</div>
	</div>
{:else}
	<!-- chat app heading  -->
	<div
		class="text-white flex justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light my-8"
	>
		<h1>Coders-Connect</h1>
	</div>
	<div class="text-right">
		<button
			on:click={leaveChat}
			class="text-white rounded-md px-2 py-1 variant-filled-error mr-2 mb-2"
		>
			Leave Chat
		</button>
	</div>
	<!-- Sidebar section -->
	<div class="md:w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-1">
		<div class="bg-surface-500/30 p-3 lg:h-[500px] lg:w-[300px]">
			<!-- Active Users Section -->
			<div class="bg-surface-500/30 p-2 mt-3">
				<h2 class="text-lg font-bold mb-2">User Name</h2>
				<div class="flex flex-col">
					<!-- Display all joined users -->
					{#each joinedUsers as user, index}
						<div class="flex items-center variant-ghost-success p-1 pl-4">
							<!-- You can modify this section to display avatars or other user details -->
							<p>{user}</p>
						</div>
					{/each}
					<!-- Display selected room -->
					{#if selectedRoom !== ''}
						<div class="mt-3">
							<h3 class="text-lg font-bold mb-2">Room</h3>
							<div class="flex items-center variant-ghost-success p-1 pl-4">
								<p>{selectedRoom}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div bind:this={elemChat} class="overflow-y-auto">
			<!-- chat section -->
			<div class="bg-surface-500/30 p-4 overflow-y-auto lg:h-[430px]">
				<section class="w-full max-h-[400px] p-4 overflow-y-auto space-y-4">
					{#each messageFeed as bubble, i}
						{#if bubble.room === selectedRoom}
							{#if bubble.host === true}
								<!-- Host Message Bubble without Avatar -->
								<div class="card p-4 rounded-{bubble.color} space-y-2">
									<header class="flex justify-between items-center">
										<p class="font-bold">{bubble.name}</p>
										<small class="opacity-100">{bubble.timestamp}</small>
									</header>
									<p>{bubble.message}</p>
								</div>
							{/if}
						{/if}
					{/each}
				</section>
			</div>
			<!-- Message input and send button -->
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<button class="input-group-shim">+</button>
				<textarea
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					on:keydown={(event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault(); // Prevents adding a newline in the textarea
							addMessage(); // Calls the addMessage function when Enter is pressed
						}
					}}
				/>

				<button on:click={addMessage} class="variant-filled-primary">Send</button>
			</div>
		</div>
	</div>
{/if}
