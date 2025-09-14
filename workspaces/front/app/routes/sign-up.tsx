import { useState } from "react";
import { signUp } from "../utils/auth-client";

export default function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	// const router = useRouter(); // TODO: Replace with React Router navigation
	const [loading, setLoading] = useState(false);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="z-50 rounded-md rounded-t-none max-w-md border rounded-lg shadow-sm">
			<div className="p-6 pb-0">
				<h1 className="text-lg md:text-xl font-semibold">Sign Up</h1>
				<p className="text-xs md:text-sm text-gray-600">
					Enter your information to create an account
				</p>
			</div>
			<div className="p-6">
				<div className="grid gap-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<label htmlFor="first-name" className="text-sm font-medium">First name</label>
							<input
								id="first-name"
								placeholder="Max"
								required
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setFirstName(e.target.value);
								}}
								value={firstName}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
						<div className="grid gap-2">
							<label htmlFor="last-name" className="text-sm font-medium">Last name</label>
							<input
								id="last-name"
								placeholder="Robinson"
								required
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									setLastName(e.target.value);
								}}
								value={lastName}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							/>
						</div>
					</div>
					<div className="grid gap-2">
						<label htmlFor="email" className="text-sm font-medium">Email</label>
						<input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setEmail(e.target.value);
							}}
							value={email}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="password" className="text-sm font-medium">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
							autoComplete="new-password"
							placeholder="Password"
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="password_confirmation" className="text-sm font-medium">Confirm Password</label>
						<input
							id="password_confirmation"
							type="password"
							value={passwordConfirmation}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
							autoComplete="new-password"
							placeholder="Confirm Password"
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<div className="grid gap-2">
						<label htmlFor="image" className="text-sm font-medium">Profile Image (optional)</label>
						<div className="flex items-end gap-4">
							{imagePreview && (
								<div className="relative w-16 h-16 rounded-sm overflow-hidden">
									<img
										src={imagePreview}
										alt="Profile preview"
										className="w-full h-full object-cover"
									/>
								</div>
							)}
							<div className="flex items-center gap-2 w-full">
								<input
									id="image"
									type="file"
									accept="image/*"
									onChange={handleImageChange}
									className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								/>
								{imagePreview && (
									<button
										type="button"
										className="cursor-pointer p-1 hover:bg-gray-100 rounded"
										onClick={() => {
											setImage(null);
											setImagePreview(null);
										}}
									>
										×
									</button>
								)}
							</div>
						</div>
					</div>
					<button
						type="submit"
						className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
						disabled={loading}
						onClick={async () => {
							await signUp.email({
								email,
								password,
								name: `${firstName} ${lastName}`,
								image: image ? await convertImageToBase64(image) : "",
								callbackURL: "/dashboard",
								fetchOptions: {
									onResponse: () => {
										setLoading(false);
									},
									onRequest: () => {
										setLoading(true);
									},
									onError: (ctx) => {
										// toast.error(ctx.error.message); // TODO: Replace toast with alert or custom notification
										console.error('Sign up error:', ctx.error.message);
									},
									onSuccess: async () => {
										// router.push("/dashboard"); // TODO: Replace with React Router navigation
										window.location.href = '/dashboard';
									},
								},
							});
						}}
					>
						{loading ? (
							<span className="animate-spin">⟳</span>
						) : (
							"Create an account"
						)}
					</button>
				</div>
			</div>
			<div className="p-6 pt-0">
				<div className="flex justify-center w-full border-t py-4">
					<p className="text-center text-xs text-neutral-500">
						Secured by <span className="text-orange-400">better-auth.</span>
					</p>
				</div>
			</div>
		</div>
	);
}

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
