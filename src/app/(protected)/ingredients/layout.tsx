import type { ReactNode } from "react";

interface IProps {
	children: ReactNode;
}

const IngredientsLayout = ({ children }: IProps) => {
	return (
		<section className="h-full overflow-hidden">
			{children}
		</section>
	);
};

export default IngredientsLayout;