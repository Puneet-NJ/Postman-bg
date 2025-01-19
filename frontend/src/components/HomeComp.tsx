import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import MonacoEditor from "@monaco-editor/react";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";

export function HomeComp() {
	const defaultLanguages = useRef({
		json: "{}",
		text: "Sample text",
		xml: "<root></root>",
		html: "<div></div>",
	});
	const [editorData, setEditorData] = useState({
		lang: "json",
		value: defaultLanguages.current.json,
	});

	const [url, setUrl] = useState("");
	const [requestType, setRequestType] = useState("");
	const [bodyData, setBodyData] = useState("");
	const [params, setParams] = useState<{ key: string; value: string }[]>([]);
	const [headers, setHeaders] = useState<{ key: string; value: string }[]>([]);

	const [responseJson, setResponseJson] = useState();
	const [responseStatus, setResponseStatus] = useState();

	const sendRequestMutation = useMutation({
		mutationFn: () =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/request`,
				data: {
					url,
					params,
					headers,
					body: bodyData,
					contentType: editorData.lang,
					requestType,
				},
			}),
		onSuccess: (response) => {
			setResponseJson(response.data.data);
			setResponseStatus(response.data.status);
		},
	});

	const handleSendRequest = (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();

			sendRequestMutation.mutate();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Send Request</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
			<CardContent className="space-y-5">
				<form onSubmit={handleSendRequest}>
					<div className="grid grid-cols-5 w-full items-center gap-4">
						<div className="col-span-1 flex flex-col space-y-1.5">
							<Select
								defaultValue="get"
								onValueChange={(e) => setRequestType(e.toUpperCase())}
							>
								<SelectTrigger id="request">
									<SelectValue placeholder="GET" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="get">GET</SelectItem>
									<SelectItem value="post">POST</SelectItem>
									<SelectItem value="delete">DELETE</SelectItem>
									<SelectItem value="put">PUT</SelectItem>
									<SelectItem value="patch">PATCH</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="col-span-3 flex flex-col space-y-1.5">
							<Input
								id="name"
								placeholder="Enter a URL"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
							/>
						</div>

						<div className="col-span-1">
							<Button className="w-full bg-orange-500" type="submit">
								Send
							</Button>
						</div>
					</div>
				</form>

				<Tabs defaultValue="params" className="w-full bg-red-">
					<TabsList className="w-full">
						<TabsTrigger value="params">Params</TabsTrigger>
						<TabsTrigger value="headers">Headers</TabsTrigger>
						<TabsTrigger value="body">Body</TabsTrigger>
					</TabsList>

					<TabsContent value="params">
						<div className="flow-root">
							<Button
								className="text-xs bg-green-600 hover:bg-green-400 float-right"
								variant={"outline"}
								onClick={() => {
									const updatedParams = [...params];
									updatedParams.push({ key: "", value: "" });

									setParams(updatedParams);
								}}
							>
								<Plus /> Add entry
							</Button>
						</div>

						<Table className="w-full">
							<TableCaption>Query Params</TableCaption>

							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px] text-left">Key</TableHead>
									<TableHead className="text-left">Value</TableHead>
									<TableHead className="text-center">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{params.map((_, index) => (
									<TableRow key={index}>
										<TableCell>
											<Input
												placeholder="Key"
												value={params[index].key}
												onChange={(e) => {
													const updatedParams = [...params];
													updatedParams[index].key = e.target.value;
													setParams(updatedParams);
												}}
											/>
										</TableCell>

										<TableCell>
											<Input
												placeholder="Value"
												value={params[index].value}
												onChange={(e) => {
													const updatedParams = [...params];
													updatedParams[index].value = e.target.value;
													setParams(updatedParams);
												}}
											/>
										</TableCell>

										<TableCell className="text-center">
											<Button
												variant="outline"
												className="hover:bg-red-400"
												onClick={() => {
													const updatedParams = params.filter(
														(_, i) => i !== index
													);
													setParams(updatedParams);
												}}
											>
												Delete
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TabsContent>

					<TabsContent value="headers">
						<div className="flow-root">
							<Button
								className="float-right bg-green-600 hover:bg-green-400 text-xs text-black"
								onClick={() => {
									const updatedHeaders = [...headers];
									updatedHeaders.push({ key: "", value: "" });

									setHeaders(updatedHeaders);
								}}
							>
								<Plus /> Add entry
							</Button>
						</div>

						<Table>
							<TableCaption>Headers</TableCaption>

							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Key</TableHead>
									<TableHead className="text-left">Value</TableHead>
									<TableHead className="text-center">Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{headers.map((_, index) => {
									return (
										<TableRow key={index}>
											<TableCell className="font-medium">
												<Input
													placeholder="Key"
													value={headers[index].key}
													onChange={(e) => {
														const updatedHeaders = [...headers];
														updatedHeaders[index].key = e.target.value;

														setHeaders(updatedHeaders);
													}}
												/>
											</TableCell>
											<TableCell className="text-right">
												<Input
													placeholder="Value"
													value={headers[index].value}
													onChange={(e) => {
														const updatedHeaders = [...headers];
														updatedHeaders[index].value = e.target.value;

														setHeaders(updatedHeaders);
													}}
												/>
											</TableCell>

											<TableCell className="text-center">
												<Button
													variant="outline"
													className="hover:bg-red-400"
													onClick={() => {
														const updatedHeaders = headers.filter(
															(_, i) => i !== index
														);
														setHeaders(updatedHeaders);
													}}
												>
													Delete
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TabsContent>

					<TabsContent value="body" className="space-y-3">
						<div className="w-[30%] mx-auto">
							<Select
								defaultValue="json"
								onValueChange={(e) => {
									if (
										e === "json" ||
										e === "text" ||
										e === "xml" ||
										e === "html"
									) {
										setEditorData({
											lang: e,
											value: defaultLanguages.current[e],
										});

										setBodyData(defaultLanguages.current[e]);
									}
								}}
							>
								<SelectTrigger id="content_type">
									<SelectValue placeholder="JSON" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value="json">JSON</SelectItem>
									<SelectItem value="text">TEXT</SelectItem>
									<SelectItem value="xml">XML</SelectItem>
									<SelectItem value="html">HTML</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<MonacoEditor
								height="300px"
								language={editorData.lang}
								value={editorData.value}
								theme="vs-dark"
								onChange={(newValue) => {
									setBodyData(newValue || "");
								}}
								options={{ automaticLayout: true }}
							/>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>

			<CardFooter className="flex flex-col border-t py-5 bg-gray-200">
				<p>Data: {JSON.stringify(responseJson, null, 2)}</p>
				<div>Status: {responseStatus}</div>
			</CardFooter>
		</Card>
	);
}
