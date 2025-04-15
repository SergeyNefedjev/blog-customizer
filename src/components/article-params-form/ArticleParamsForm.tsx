import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import styles from './ArticleParamsForm.module.scss';
import { clsx } from 'clsx';
import { Text } from 'src/ui/text';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { useState, useRef, useEffect } from 'react';
import {
	backgroundColors,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
	contentWidthArr,
	ArticleStateType,
} from 'src/constants/articleProps';

type ArticleParamsFormProps = {
	onApply: (newState: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
	const [sideBarOpen, setSideBarOpen] = useState(false);
	const [sideBarState, setSideBarState] = useState(defaultArticleState);
	const sideBarRef = useRef<HTMLElement | null>(null);

	function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onApply(sideBarState);
	}

	function handleFormChange(
		key: keyof ArticleStateType,
		value: ArticleStateType[keyof ArticleStateType]
	) {
		setSideBarState((prev) => ({ ...prev, [key]: value }));
	}

	function handleFormReset() {
		setSideBarState(defaultArticleState);
		onApply(defaultArticleState);
	}

	useEffect(() => {
		if (!sideBarOpen) return;

		function handleClickEsc(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setSideBarOpen(false);
			}
		}

		function handleClickOutside(event: MouseEvent) {
			if (
				sideBarRef.current &&
				!sideBarRef.current.contains(event.target as Node)
			) {
				setSideBarOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleClickEsc);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleClickEsc);
		};
	}, [sideBarOpen]);

	return (
		<>
			<ArrowButton
				isOpen={sideBarOpen}
				onClick={() => {
					setSideBarOpen(!sideBarOpen);
				}}
			/>
			<aside
				ref={sideBarRef}
				className={clsx(styles.container, {
					[styles.container_open]: sideBarOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={handleFormReset}>
					<Text as='h2' size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						selected={sideBarState.fontFamilyOption}
						title='Шрифт'
						options={fontFamilyOptions}
						onChange={(value) =>
							handleFormChange('fontFamilyOption', value)
						}></Select>
					<RadioGroup
						name='radio'
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={sideBarState.fontSizeOption}
						onChange={(value) =>
							handleFormChange('fontSizeOption', value)
						}></RadioGroup>
					<Select
						selected={sideBarState.fontColor}
						title='Цвет шрифта'
						options={fontColors}
						onChange={(value) => handleFormChange('fontColor', value)}></Select>
					<Separator />
					<Select
						selected={sideBarState.backgroundColor}
						title='Цвет фона'
						options={backgroundColors}
						onChange={(value) =>
							handleFormChange('backgroundColor', value)
						}></Select>
					<Select
						selected={sideBarState.contentWidth}
						title='ширина контента'
						options={contentWidthArr}
						onChange={(value) =>
							handleFormChange('contentWidth', value)
						}></Select>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
