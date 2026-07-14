	"use client"
	import { X } from "lucide-react";
	import {
		Modal,
		ModalBackdrop,
		ModalBody,
		ModalContainer,
		ModalDialog,
		ModalHeader,
		ModalHeading,
		Button,
	} from "@heroui/react";
	import { ReactNode } from 'react';


	interface IProps {
		isOpen: boolean;
		onClose: () => void;
		title: string;
		children: ReactNode;
		size?: "xs" | "sm" | "md" | "lg" | "cover" | "full";
	}

	const CustomModal = ({
		isOpen,
		onClose,
		title,
		children,
		size = "md",
	}: IProps) => {
		const handleOpenChange = (open: boolean) => {
			if (!open) {
				onClose();
			}
		};

		return (
			<Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
				{[
					<span key="trigger" className="hidden" aria-hidden="true" />,
					<ModalBackdrop key="backdrop">
						<ModalContainer size={size}>
							<ModalDialog>
								<ModalHeader className="grid grid-cols-[1fr_auto] items-center gap-2 border-b pb-3">
									<ModalHeading className="text-md font-semibold !text-black">
										{title}
									</ModalHeading>

									<Button
										isIconOnly
										variant="ghost"
										size="sm"
										onPress={onClose}
										aria-label="Закрыть"
									>
										<X size={25} />
									</Button>
								</ModalHeader>
								<ModalBody className="space-y-4 py-6">{children}</ModalBody>
							</ModalDialog>
						</ModalContainer>
					</ModalBackdrop>,
				]}
			</Modal>
		);
	}
	export default CustomModal;