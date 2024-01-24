<script lang="ts">
	import { onMount } from 'svelte';
	import { io, Socket } from 'socket.io-client';

	let showChat = false; // Initially, don't show the chat interface
	let joinedUsers: string[] = [];

	function startChat(): void {
		if (username.trim() !== '' && selectedRoom !== '') {
			showChat = true;
			joinedUsers = [...joinedUsers, username];
		}
	}

	let selectedRoom = ''; // Variable to store the selected room

	function joinChatRoom(room: string): void {
		if (username.trim() !== '' && room !== '') {
			selectedRoom = room;
			startChat();
		}
	}

	let username = ''; // Added username input field
	let messageFeed: ChatMessage[] = [];

	interface ChatMessage {
		username: string;
		message: string;
		timestamp: string;
		host: boolean;
		name: string;
		color: string;
		room: string;
		image?: string; // Include an optional image property for handling images
		pdf?: string; // Include an optional pdf property for handling PDFs
	}

	function leaveChat(): void {
		// Clear all messages from the selected room
		messageFeed = messageFeed.filter((message) => message.room !== selectedRoom);
		// Remove the current user from the list of joined users
		joinedUsers = joinedUsers.filter((user) => user !== username);
		// Clear the selected room
		selectedRoom = '';
		// Hide the chat interface
		showChat = false;
	}

	let elemChat: HTMLElement;

	let showBotMessage = false;

	function generateBotMessage() {
		const botMessage: ChatMessage = {
			username: 'Bot',
			message: ' Hey ! Do you want to know something about me ?',
			timestamp: new Date().toLocaleString(),
			host: true,
			name: 'Bot',
			color: '',
			room: selectedRoom
		};

		messageFeed = [...messageFeed, botMessage];
		showBotMessage = true;
	}

	let showBotResponse = false; // Variable to track showing additional app information

	function handleBotResponse(response: string) {
		console.log('User responded:', response);

		if (response === 'Yes') {
			// Show more information about the app if the user responded positively
			showBotResponse = true; // Show additional information about the app
			showBotMessage = true; // Hide the bot message prompt
		} else if (response === 'No') {
			// Hide the bot message if the user responded negatively
			showBotMessage = false;
		}
	}

	let showBotNextMessage = false; // Variable to track showing the next bot message

	function handleNext() {
		showBotResponse = true; // Hide the current bot response message
		showBotNextMessage = true; // Show the next bot message
	}

	function handleOK() {
		showBotMessage = false; // Hide the bot message prompt
		showBotResponse = false; // Hide additional app information
		showBotNextMessage = false; // Hide the next bot message
		messageFeed = []; // Clear all bot messages
	}

	let imageFile: File | null = null; // Declare imageFile as File or null
	let isFileSelected = false;

	function handleImageUpload(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (target?.files && target.files[0]) {
			imageFile = target.files[0];
			isFileSelected = true;
		}
	}

	let pdfFile: File | null = null; // Declare pdfFile as File or null

	function handlePDFUpload(event: Event): void {
		const target = event.target as HTMLInputElement;
		if (target?.files && target.files[0]) {
			pdfFile = target.files[0];
			isFileSelected = true;
		}
	}

	let currentMessage = '';

	function addMessage(): void {
		if (currentMessage.trim() !== '' || imageFile || pdfFile) {
			// Check if there's text, an image, or a PDF
			let newMessage: ChatMessage;

			if (imageFile) {
				// If an image is selected, create a new message object with the image
				newMessage = {
					username,
					message: '', // Clear the message field for image-only messages
					timestamp: new Date().toLocaleString(),
					host: true,
					name: username,
					color: '',
					room: selectedRoom,
					image: URL.createObjectURL(imageFile) // Create a URL for the selected image
				};
				// Emit 'chat message' event to the server with the new message containing the image
				socket.emit('chat message', newMessage);
				imageFile = null; // Reset the imageFile variable after sending
			} else if (pdfFile) {
				// If a PDF is selected, create a new message object with the PDF
				newMessage = {
					username,
					message: '', // Clear the message field for PDF-only messages
					timestamp: new Date().toLocaleString(),
					host: true,
					name: username,
					color: '',
					room: selectedRoom,
					pdf: URL.createObjectURL(pdfFile) // Create a URL for the selected PDF
				};
				// Emit 'chat message' event to the server with the new message containing the PDF
				socket.emit('chat message', newMessage);
				pdfFile = null; // Reset the pdfFile variable after sending
			} else {
				// If it's a text message
				newMessage = {
					username,
					message: currentMessage,
					timestamp: new Date().toLocaleString(),
					host: true,
					name: username,
					color: '',
					room: selectedRoom
				};
				// Emit 'chat message' event to the server with the new message containing text
				socket.emit('chat message', newMessage);
			}

			currentMessage = ''; // Clear the message input field
		}
	}

	let socket: Socket;

	onMount(() => {
		socket = io('http://localhost:3000');

		// Listen for 'chat message' event from the server
		socket.on('chat message', (message) => {
			messageFeed = [...messageFeed, message];
			scrollChatBottom('smooth');
		});
		generateBotMessage();
	});

	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
	}
</script>

<!-- /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

{#if !showChat}
	<!-- landing page -->

	<div class="flex flex-col items-center justify-center h-screen">
		<!-- Title with Logo -->
		<div class="mb-5 flex items-center flex-col">
			<img src="/chat.png" alt="Logo" class="h-12 mr-2" />
			<h1 class="text-3xl font-bold">Coders-Connect</h1>
		</div>
		<div class="rounded-lg bg-gray-600 p-10">
			<div class="mb-3 w-full max-w-md">
				<label for="usename" class="mb-1">Name</label>
				<input
					bind:value={username}
					class="rounded border p-2 text-black w-full mb-2"
					type="text"
					placeholder="Enter your name"
				/>
				<!-- Room selection dropdown -->
				<label for="usename" class="mb-1">Select Room</label>
				<select bind:value={selectedRoom} class="rounded border px-3 py-2 text-black w-full mb-2">
					<option value="">Select Room</option>
					<option value="General">General</option>
					<option value="Projects">Projects</option>
					<option value="Ui-Ux">Ui-Ux</option>
					<option value="Svelte Training">Svelte Training</option>
					<!-- Add more rooms as needed -->
				</select>
				<button
					on:click={() => joinChatRoom(selectedRoom)}
					class="px-4 py-2 bg-blue-500 text-white rounded w-full mt-1"
				>
					Join Chat
				</button>
			</div>
		</div>
	</div>

	<!-- landing page ends -->
{:else}
	<!-- chat app heading  -->
	<div
		class="text-white flex flex-col items-center justify-center text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light mt-6 mb-6"
	>
		<img
			src="/chat.png"
			alt="logo"
			class="w-10 h-10 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-14 xl:h-14 mb-2"
		/>
		<h1 class="text-center">Coders-Connect</h1>
	</div>
	<!-- chat app heading ends -->

	<!-- user and room section -->
	<div class="md:w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-1">
		<div class="bg-surface-500/30 p-3 lg:h-[525px] lg:w-[300px]">
			<!-- Active Users Section -->
			<div class="bg-surface-500/30 p-2 mt-3">
				<h2 class="text-lg font-bold mb-2">Name</h2>
				<div class="flex flex-col">
					<!-- Display name -->
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
			<!-- leave chat btn -->
			<div class="text-left mt-4 ml-2">
				<button
					on:click={leaveChat}
					class="variant-filled-error px-3 py-1 rounded-lg hover:bg-red-800"
				>
					log out
				</button>
			</div>
			<!-- leave chat btn ends -->
		</div>
		<!-- user and room section ends-->

		<!-- Chat interface section -->
		<div bind:this={elemChat} class="overflow-y-auto">
			<!-- chat section -->
			<div class="bg-surface-500/30 p-4 overflow-y-auto md:h-[430px] lg:h-[430px]">
				{#if showBotMessage}
					<!-- Bot message card with 'Yes' and 'No' buttons -->
					<div class="card p-4 rounded bg-gray-200">
						<p>{messageFeed[messageFeed.length - 1].message}</p>

						<div class="mt-4">
							<button
								on:click={() => handleBotResponse('Yes')}
								class="variant-filled-secondary mr-2 px-4 py-1 rounded-lg hover:bg-blue-600"
								>Yes</button
							>
							{#if !showBotResponse}
								<button
									on:click={() => handleBotResponse('No')}
									class="variant-filled-error px-5 py-1 rounded-lg hover:bg-red-800">No</button
								>
							{/if}
						</div>
					</div>
				{/if}
				{#if showBotResponse}
					<div class="card p-4 rounded bg-gray-200">
						<!-- Display the information about the app -->
						<p>You can chat with anyone within selected Room !</p>
						<!-- Add a 'Next' button to proceed -->
						<div class=" mt-4">
							<button
								on:click={handleNext}
								class="variant-filled-secondary px-4 py-1 rounded-lg hover:bg-blue-600"
							>
								Next
							</button>
						</div>
					</div>
				{/if}

				{#if showBotNextMessage}
					<!-- Display another message with an 'OK' button -->
					<div class="card p-4 rounded bg-gray-200">
						<p>Now sharing Images and Pdf becomes so easy !</p>
						<div class=" mt-4">
							<button
								on:click={handleOK}
								class="variant-filled-primary px-4 py-1 rounded-lg hover:bg-green-400 hover:text-black"
							>
								OK ! Fine
							</button>
						</div>
					</div>
				{/if}

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
									<!-- Display img if present -->
									{#if bubble.image}
										<img src={bubble.image} alt="SentImage" class="w-40 h-auto" />
									{/if}
									<!-- Display PDF if present -->
									{#if bubble.pdf}
										<a href={bubble.pdf} target="_blank" rel="noopener noreferrer">
											<i
												class="fas fa-file-pdf text-red-500 ml-4 mt-2 mb-1"
												style="font-size: 30px;"
											></i></a
										>
									{/if}
									<p>{bubble.message}</p>
								</div>
							{/if}
						{/if}
					{/each}
				</section>
			</div>
			<!-- Chat interface section ends-->

			<!-- upload image icon -->
			<div
				class="input-group input-group-divider grid-cols-[auto_1fr_auto] rounded-container-token"
			>
				<input
					type="file"
					on:change={handleImageUpload}
					class="hidden"
					id="imageUpload"
					accept="image/*"
				/>

				<label for="imageUpload" class="input-group-shim cursor-pointer">
					<i class="fas fa-image text-blue-500 ml-4 mt-1 mb-1" style="font-size: 20px;"></i>
				</label>

				<!-- upload image icon ends -->

				<!-- PDF upload icon -->
				<input
					type="file"
					on:change={handlePDFUpload}
					class="hidden"
					id="pdfUpload"
					accept=".pdf"
				/>

				<label for="pdfUpload" class="input-group-shim cursor-pointer w-[36px] h-[28px]">
					<i class="far fa-file-pdf text-red-500 ml-4 mt-1 mb-1" style="font-size: 20px;"></i>
					<!-- FontAwesome PDF icon -->
				</label>
				<!-- PDF upload icon ends -->

				<!-- Message prompt for selected image ,pdf ... -->
				{#if imageFile}
					<p class="text-sm text-white m-1">{imageFile.name}</p>
				{/if}

				{#if pdfFile}
					<p class="text-sm text-white m-1">{pdfFile.name}</p>
				{/if}
				<!-- Message prompt for selected image ,pdf ... ends-->

				<!-- Text area for typing messages -->
				<textarea
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0 col-span-2"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					on:keydown={(event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault();
							addMessage();
						}
					}}
				></textarea>

				<!-- Text area for typing messages ends -->

				<!-- send btn -->
				<button on:click={addMessage} class="variant-filled-primary p-2">Send</button>
			</div>
		</div>
	</div>
{/if}
